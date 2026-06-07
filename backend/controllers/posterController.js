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
    } = req.body;

    const prompt = `Create a cinematic movie poster with ultra-realistic quality, suitable for a film trailer release. Include the following details:
- Film Title: "${title}" (prominently displayed, bold typography)
- Genre: ${genre}
- Mood/Atmosphere: ${mood} (e.g., Dark & Moody, Dreamy, Futuristic)
- Tagline: "${tagline}" (short and impactful, place it like a movie poster tagline)
- Language: ${language} (optional in small text)
- Font Style: ${fontStyle} (Cinematic, bold, readable)
- Style Preset: ${stylePreset} (Photo-Real, Illustrated, etc.)
- Aspect Ratio: ${aspectRatio} (poster format)
- Visual References: ${styleReference || "dramatic lighting, neon glow, high contrast, cinematic composition"}

Additional elements to include:
- Release date at the bottom (fake or current date)
- Small production/studio logo in corner
- Film grain, professional lighting, high contrast, 4K resolution
- Composition similar to official movie trailers
- Include realistic shadows, reflections, depth
- Make it feel like a real blockbuster poster, not just text on background
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
