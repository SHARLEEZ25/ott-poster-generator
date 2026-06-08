import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
ffmpeg.setFfmpegPath(ffmpegPath.path);

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms)
    ),
  ]);

async function uploadVideoToGemini(videoPath, mimeType) {
  console.log("  [Gemini] Uploading video to Gemini File API...");
  const uploadResult = await genai.files.upload({
    file: videoPath,
    config: { mimeType },
  });
  console.log(`  [Gemini] Upload done. File name: ${uploadResult.name}, state: ${uploadResult.state}`);

  let file = uploadResult;
  while (file.state === "PROCESSING") {
    console.log("  [Gemini] Still processing... waiting 3s");
    await new Promise((r) => setTimeout(r, 3000));
    file = await genai.files.get({ name: file.name });
    console.log(`  [Gemini] State: ${file.state}`);
  }

  if (file.state !== "ACTIVE") {
    throw new Error(`Gemini file processing failed with state: ${file.state}`);
  }

  console.log("  [Gemini] File is ACTIVE and ready for analysis");
  return file;
}

async function askGeminiForBestFrame(geminiFile) {
  console.log("  [Gemini] Asking Gemini to pick the best cinematic frame...");
  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          {
            fileData: {
              fileUri: geminiFile.uri,
              mimeType: geminiFile.mimeType,
            },
          },
          {
            text: `Analyze this video carefully. Identify the single most cinematic, visually striking, and emotionally powerful frame — the kind of frame that would work best as a movie poster.

Return ONLY a valid JSON object with no extra text, no markdown, no code blocks. Example:
{"timestamp": 42.5, "description": "A lone figure stands at the edge of a cliff at golden hour, dramatic backlighting, silhouette against an orange sky, cinematic widescreen composition"}

Rules:
- timestamp: the exact time in seconds (float) of the best frame
- description: a vivid, detailed visual description of that frame including lighting, colors, composition, mood, and any notable elements
- Do not include any other text outside the JSON`,
          },
        ],
      },
    ],
  });

  const raw = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  console.log("  [Gemini] Raw response:", raw?.slice(0, 200));

  if (!raw) throw new Error("Gemini returned empty response");

  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const parsed = JSON.parse(cleaned);
  console.log(`  [Gemini] Parsed → timestamp: ${parsed.timestamp}s | description: "${parsed.description?.slice(0, 80)}..."`);
  return parsed;
}

function getVideoDuration(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration || 0);
    });
  });
}

function extractFrameAtTimestamp(videoPath, timestamp, outputDir, label = "best_frame") {
  return new Promise((resolve, reject) => {
    const filename = `${label}_${Date.now()}.png`;
    const filePath = path.join(outputDir, filename);

    console.log(`  [ffmpeg] Extracting frame at ${timestamp}s → ${filename}`);
    ffmpeg(videoPath)
      .screenshots({
        timestamps: [timestamp],
        filename,
        folder: outputDir,
        size: "640x960",
      })
      .on("end", () => {
        console.log("  [ffmpeg] Frame extracted successfully");
        resolve(filePath);
      })
      .on("error", (err) => {
        console.error("  [ffmpeg] Frame extraction error:", err.message);
        reject(err);
      });
  });
}

async function extractAlternateFrames(videoPath, duration, outputDir, count = 6) {
  console.log(`  [ffmpeg] Extracting ${count} alternate frames across ${duration.toFixed(1)}s video...`);
  const timestamps = Array.from({ length: count }, (_, i) =>
    parseFloat(((duration / (count + 1)) * (i + 1)).toFixed(2))
  );

  const results = await Promise.allSettled(
    timestamps.map((t, i) => extractFrameAtTimestamp(videoPath, t, outputDir, `alt_frame_${i + 1}`))
  );

  return results.filter((r) => r.status === "fulfilled").map((r) => r.value);
}

export const uploadVideoAndExtractFrames = async (req, res) => {
  let geminiFileName = null;
  let videoPath = null;

  console.log("\n─────────────────────────────────────────");
  console.log("📹 VIDEO UPLOAD REQUEST received");

  try {
    if (!req.file) {
      console.log("  ❌ No file in request");
      return res.status(400).json({ error: "No video uploaded" });
    }

    videoPath = req.file.path;
    const mimeType = req.file.mimetype || "video/mp4";

    console.log(`  File: ${req.file.originalname}`);
    console.log(`  Size: ${(req.file.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`  MIME: ${mimeType}`);

    const framesDir = path.join(process.cwd(), "frames", Date.now().toString());
    fs.mkdirSync(framesDir, { recursive: true });

    let timestamp = null;
    let description = null;
    let usedGemini = false;

    // Get video duration (needed for both paths)
    let duration = 30;
    try {
      duration = await getVideoDuration(videoPath);
      console.log(`  Video duration: ${duration.toFixed(1)}s`);
    } catch {
      console.warn("  Could not read duration, assuming 30s");
    }

    // Run Gemini analysis and alternate frames in parallel
    const [geminiResult, altFramePaths] = await Promise.allSettled([
      process.env.GEMINI_API_KEY
        ? withTimeout(
            (async () => {
              console.log("\n  🤖 Starting Gemini analysis...");
              const geminiFile = await uploadVideoToGemini(videoPath, mimeType);
              geminiFileName = geminiFile.name;
              return await askGeminiForBestFrame(geminiFile);
            })(),
            90000, // 90s timeout
            "Gemini"
          )
        : Promise.reject(new Error("No GEMINI_API_KEY")),

      extractAlternateFrames(videoPath, duration, framesDir, 6),
    ]);

    if (geminiResult.status === "fulfilled") {
      timestamp = geminiResult.value.timestamp;
      description = geminiResult.value.description;
      usedGemini = true;
      console.log(`  ✅ Gemini done → best frame at ${timestamp}s`);
    } else {
      console.warn(`  ⚠️  Gemini failed: ${geminiResult.reason?.message}`);
      timestamp = Math.floor(duration * 0.3);
      console.log(`  ↳ ffmpeg fallback → picking frame at ${timestamp}s`);
    }

    const framePath = await extractFrameAtTimestamp(videoPath, timestamp, framesDir);

    const toUrl = (absPath) => {
      const rel = path.relative(path.join(process.cwd(), "frames"), absPath);
      const protocol = process.env.RENDER ? "https" : req.protocol;
      return `${protocol}://${req.get("host")}/frames/${rel.split(path.sep).join("/")}`;
    };

    const frameUrl = toUrl(framePath);
    const altUrls = altFramePaths.status === "fulfilled" ? altFramePaths.value.map(toUrl) : [];

    console.log(`\n  ✅ SUCCESS — Primary frame: ${frameUrl}`);
    console.log(`  Alternate frames: ${altUrls.length} extracted`);
    console.log(`  Source: ${usedGemini ? "Gemini AI" : "ffmpeg fallback"}`);
    console.log("─────────────────────────────────────────\n");

    return res.json({
      success: true,
      frame: frameUrl,
      frameDescription: description,
      timestamp,
      source: usedGemini ? "gemini" : "ffmpeg-fallback",
      alternateFrames: altUrls,
    });
  } catch (error) {
    console.error(`\n  ❌ FATAL ERROR: ${error.message}`);
    console.error(error.stack);
    console.log("─────────────────────────────────────────\n");
    res.status(500).json({ error: "Video processing failed. Please try again." });
  } finally {
    // Delete uploaded video from disk — frames stay (they're served to browser)
    if (videoPath && fs.existsSync(videoPath)) {
      fs.unlink(videoPath, (err) => {
        if (err) console.warn("  [cleanup] Failed to delete video:", err.message);
        else console.log("  [cleanup] Uploaded video deleted from disk");
      });
    }
    // Clean up Gemini file
    if (geminiFileName) {
      genai.files.delete({ name: geminiFileName }).catch((e) => {
        console.warn("  [Gemini] Could not delete uploaded file:", e.message);
      });
    }
  }
};
