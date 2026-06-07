import { InferenceClient } from "@huggingface/inference";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  try {
    const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

    const imageBlob = await client.textToImage({
      provider: "nscale",
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: "Astronaut riding a horse",
      parameters: { num_inference_steps: 5 },
    });

    // Convert Blob → Buffer
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save image to your folder
    fs.writeFileSync("output.png", buffer);

    console.log("✅ Image generated and saved as output.png");
  } catch (err) {
    console.log("❌ Error:", err.message || err);
  }
}

run();
