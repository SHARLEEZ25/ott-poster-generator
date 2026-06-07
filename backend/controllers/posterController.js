import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

export const generatePosterFromFrame = async (req, res) => {
  try {
    const {
      title,
      genre,
      mood,
      tagline,
      language,
      fontStyle,
      stylePreset,
      aspectRatio,
      styleReference,
      frameDescription,
    } = req.body;

    // Build the visual foundation from Gemini's frame analysis if available
    const visualBase = frameDescription
      ? `Visual scene from the film: ${frameDescription}.`
      : "Cinematic movie scene with dramatic lighting and professional composition.";

    const prompt = `Create a cinematic movie poster with ultra-realistic quality, suitable for a film trailer release.

VISUAL SCENE (extracted from the actual film):
${visualBase}

POSTER DETAILS:
- Film Title: "${title}" (prominently displayed, bold typography)
- Genre: ${genre}
- Mood/Atmosphere: ${mood}
- Tagline: "${tagline || "No tagline — let the image speak"}" (short and impactful)
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

    const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

    const imageBlob = await client.textToImage({
      provider: "nscale",
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
      parameters: { num_inference_steps: 8 },
    });

    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    return res.json({
      success: true,
      poster: `data:image/png;base64,${base64Image}`,
      promptUsed: prompt,
    });
  } catch (error) {
    console.error("Poster generation failed:", error.message);
    return res.status(500).json({ success: false, error: "Poster generation failed. Please try again." });
  }
};
