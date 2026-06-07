import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

// Strip characters that could break out of the prompt template
const sanitize = (str, maxLen = 300) =>
  typeof str === "string"
    ? str.replace(/[`"\\]/g, "").replace(/[\n\r]/g, " ").trim().slice(0, maxLen)
    : "";

const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms)
    ),
  ]);

export const generatePosterFromFrame = async (req, res) => {
  console.log("\n─────────────────────────────────────────");
  console.log("🎨 POSTER GENERATION REQUEST received");

  try {
    const title         = sanitize(req.body.title, 100);
    const genre         = sanitize(req.body.genre, 50);
    const mood          = sanitize(req.body.mood, 50);
    const tagline       = sanitize(req.body.tagline, 150);
    const language      = sanitize(req.body.language, 10);
    const fontStyle     = sanitize(req.body.fontStyle, 50);
    const stylePreset   = sanitize(req.body.stylePreset, 50);
    const aspectRatio   = sanitize(req.body.aspectRatio, 10);
    const styleReference  = sanitize(req.body.styleReference, 200);
    const frameDescription = sanitize(req.body.frameDescription, 500);

    if (!title) {
      return res.status(400).json({ success: false, error: "Film title is required." });
    }

    console.log(`  Title:    "${title}"`);
    console.log(`  Genre:    ${genre}`);
    console.log(`  Mood:     ${mood}`);
    console.log(`  Tagline:  "${tagline || "(none)"}"`);
    console.log(`  Style:    ${stylePreset} | ${aspectRatio}`);
    console.log(`  Gemini frame description: ${frameDescription ? `"${frameDescription.slice(0, 80)}..."` : "(none)"}`);

    const visualBase = frameDescription
      ? `Visual scene from the film: ${frameDescription}.`
      : "Cinematic movie scene with dramatic lighting and professional composition.";

    const prompt = `Create a cinematic movie poster with ultra-realistic quality, suitable for a film trailer release.

VISUAL SCENE (extracted from the actual film):
${visualBase}

POSTER DETAILS:
- Film Title: ${title} (prominently displayed, bold typography)
- Genre: ${genre}
- Mood/Atmosphere: ${mood}
- Tagline: ${tagline || "No tagline — let the image speak"} (short and impactful)
- Language: ${language}
- Font Style: ${fontStyle}
- Style Preset: ${stylePreset}
- Aspect Ratio: ${aspectRatio} (portrait poster format)
- Additional Style: ${styleReference || "dramatic lighting, high contrast, cinematic composition"}

POSTER REQUIREMENTS:
- The poster should be visually inspired by the scene described above
- Include the film title prominently at the top or bottom
- Add the tagline in smaller text
- Release date at the bottom
- Film grain, professional lighting, 4K resolution
- Make it feel like a real blockbuster OTT release poster
Output format: PNG, high-resolution, cinematic style`;

    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error("  ❌ HUGGINGFACE_API_KEY is not set in .env");
      return res.status(500).json({ success: false, error: "Server configuration error." });
    }

    console.log(`\n  [HuggingFace] Sending request to FLUX.1-schnell...`);
    console.log(`  Prompt length: ${prompt.length} characters`);

    const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

    const imageBlob = await withTimeout(
      client.textToImage({
        model: "black-forest-labs/FLUX.1-schnell",
        inputs: prompt,
        parameters: { num_inference_steps: 4 },
      }),
      120000, // 120s timeout
      "HuggingFace"
    );

    console.log("  [HuggingFace] Image received, converting to base64...");

    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    console.log(`  ✅ SUCCESS — Poster generated (${(buffer.length / 1024).toFixed(1)} KB)`);
    console.log("─────────────────────────────────────────\n");

    return res.json({
      success: true,
      poster: `data:image/png;base64,${base64Image}`,
      promptUsed: prompt,
    });
  } catch (error) {
    console.error(`\n  ❌ POSTER ERROR: ${error.message}`);
    console.error(error.stack);
    console.log("─────────────────────────────────────────\n");
    return res.status(500).json({ success: false, error: "Poster generation failed. Please try again." });
  }
};
