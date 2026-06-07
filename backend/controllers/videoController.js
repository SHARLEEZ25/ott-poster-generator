import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath.path);

export const uploadVideoAndExtractFrames = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No video uploaded" });

    const videoPath = req.file.path;
    const framesDir = path.join(process.cwd(), "frames", Date.now().toString());
    fs.mkdirSync(framesDir, { recursive: true });

    ffmpeg.ffprobe(videoPath, async (err, metadata) => {
      if (err) {
        console.error("ffprobe error:", err);
        return res.status(500).json({ error: "Could not read video file" });
      }

      const duration = metadata.format.duration || 0;
      const frameCount = 4;
      const timestamps = Array.from(
        { length: frameCount },
        (_, i) => (duration / (frameCount + 1)) * (i + 1)
      );

      const extractFrame = (timestamp, index) => {
        return new Promise((resolve, reject) => {
          const filename = `frame_${index + 1}.png`;
          const filePath = path.join(framesDir, filename);

          ffmpeg(videoPath)
            .screenshots({
              timestamps: [timestamp],
              filename,
              folder: framesDir,
              size: "640x360",
            })
            .on("end", () => resolve(filePath))
            .on("error", (error) => {
              console.error("Frame extraction error:", error);
              reject(error);
            });
        });
      };

      let generatedFrames;
      try {
        generatedFrames = await Promise.all(
          timestamps.map((t, i) => extractFrame(t, i))
        );
      } catch (err) {
        console.error("Frame extraction failed:", err);
        return res.status(500).json({ error: "Frame extraction failed" });
      }

      const protocol = req.protocol;
      const host = req.get("host");
      const fullUrls = generatedFrames.map((absPath) => {
        const rel = path.relative(path.join(process.cwd(), "frames"), absPath);
        return `${protocol}://${host}/frames/${rel.split(path.sep).join("/")}`;
      });

      return res.json({ success: true, frames: fullUrls });
    });
  } catch (error) {
    console.error("uploadVideoAndExtractFrames error:", error);
    res.status(500).json({ error: "Video processing failed" });
  }
};
