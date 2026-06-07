import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
ffmpeg.setFfmpegPath(ffmpegPath.path);

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function uploadVideoToGemini(videoPath, mimeType) {
  const uploadResult = await genai.files.upload({
    file: videoPath,
    config: { mimeType },
  });

  // Poll until file is ACTIVE (Gemini processes it asynchronously)
  let file = uploadResult;
  while (file.state === "PROCESSING") {
    await new Promise((r) => setTimeout(r, 3000));
    file = await genai.files.get({ name: file.name });
  }

  if (file.state !== "ACTIVE") {
    throw new Error(`Gemini file processing failed: ${file.state}`);
  }

  return file;
}

async function askGeminiForBestFrame(geminiFile) {
  const model = genai.models;
  const response = await model.generateContent({
    model: "gemini-1.5-flash",
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
  if (!raw) throw new Error("Gemini returned empty response");

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  return JSON.parse(cleaned);
}

function extractFrameAtTimestamp(videoPath, timestamp, outputDir) {
  return new Promise((resolve, reject) => {
    const filename = `best_frame_${Date.now()}.png`;
    const filePath = path.join(outputDir, filename);

    ffmpeg(videoPath)
      .screenshots({
        timestamps: [timestamp],
        filename,
        folder: outputDir,
        size: "640x960",
      })
      .on("end", () => resolve(filePath))
      .on("error", reject);
  });
}

export const uploadVideoAndExtractFrames = async (req, res) => {
  let geminiFileName = null;

  try {
    if (!req.file) return res.status(400).json({ error: "No video uploaded" });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
    }

    const videoPath = req.file.path;
    const mimeType = req.file.mimetype || "video/mp4";

    // Step 1: Upload video to Gemini File API
    let geminiFile;
    try {
      geminiFile = await uploadVideoToGemini(videoPath, mimeType);
      geminiFileName = geminiFile.name;
    } catch (err) {
      console.error("Gemini upload failed:", err.message);
      return res.status(500).json({ error: "Failed to upload video to Gemini: " + err.message });
    }

    // Step 2: Ask Gemini to find the best frame
    let geminiResult;
    try {
      geminiResult = await askGeminiForBestFrame(geminiFile);
    } catch (err) {
      console.error("Gemini analysis failed:", err.message);
      return res.status(500).json({ error: "Gemini could not analyze the video: " + err.message });
    }

    const { timestamp, description } = geminiResult;

    // Step 3: Extract that exact frame with ffmpeg
    const framesDir = path.join(process.cwd(), "frames", Date.now().toString());
    fs.mkdirSync(framesDir, { recursive: true });

    let framePath;
    try {
      framePath = await extractFrameAtTimestamp(videoPath, timestamp, framesDir);
    } catch (err) {
      console.error("Frame extraction failed:", err.message);
      return res.status(500).json({ error: "Frame extraction failed: " + err.message });
    }

    // Build public URL for the extracted frame
    const rel = path.relative(path.join(process.cwd(), "frames"), framePath);
    const frameUrl = `${req.protocol}://${req.get("host")}/frames/${rel.split(path.sep).join("/")}`;

    return res.json({
      success: true,
      frame: frameUrl,
      frameDescription: description,
      timestamp,
    });
  } catch (error) {
    console.error("uploadVideoAndExtractFrames error:", error);
    res.status(500).json({ error: "Video processing failed: " + error.message });
  } finally {
    // Clean up the file from Gemini to avoid storage buildup
    if (geminiFileName) {
      genai.files.delete({ name: geminiFileName }).catch(() => {});
    }
  }
};
