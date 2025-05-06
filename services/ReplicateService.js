// services/ReplicateService.js
import supabase from '../src/lib/supabase';

const REPLICATE_API_URL = "https://api.replicate.com/v1/predictions";
const REPLICATE_API_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN;
class ReplicateService {
  // Text to Image generation
  static async textToImage(prompt, model = "stability-ai/sdxl", resolution = "1024x1024", styles = []) {
    try {
      // Add style modifiers to the prompt if any styles are selected
      let styledPrompt = prompt;
      if (styles.length > 0) {
        styledPrompt += `, ${styles.join(", ")} style`;
      }

      // Determine width and height based on resolution
      const [width, height] = resolution.split('x').map(Number);
      
      // Model-specific parameters
      const modelParams = {
        "stability-ai/sdxl": {
          version: "da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf",
          input: {
            prompt: styledPrompt,
            width,
            height,
            refine: "expert_ensemble_refiner",
            scheduler: "K_EULER",
            num_outputs: 4,
            guidance_scale: 7.5,
            apply_watermark: false,
            high_noise_frac: 0.8,
            prompt_strength: 0.8,
            num_inference_steps: 50
          }
        },
        "stability-ai/stable-diffusion": {
          version: "f178fa7a1ae43a9a9af01b833b9d2ecf97b1bcb0acfd2dc5dd04895e042863f1",
          input: {
            prompt: styledPrompt,
            width,
            height,
            num_outputs: 4,
            num_inference_steps: 50,
            guidance_scale: 7.5
          }
        },
        "midjourney/midjourney-v5": {
          version: "436b051ebd8f68d23e83d22de5e198e0995357afef113768c20f0b6fcef23c8b",
          input: {
            prompt: styledPrompt,
            width,
            height,
            num_outputs: 4,
            steps: 50
          }
        }
      };

      // Get the selected model configuration
      const selectedModel = modelParams[model] || modelParams["stability-ai/sdxl"];

      // Make the API call to Replicate
      const response = await fetch(REPLICATE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
        },
        body: JSON.stringify({
          version: selectedModel.version,
          input: selectedModel.input
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const prediction = await response.json();

      // Poll for results (Replicate API is async)
      const result = await this.pollForResults(prediction.id);

      // Format the results for our application
      const formattedResults = result.output.map((url, index) => ({
        id: `${prediction.id}-${index}`,
        imageUrl: url,
        prompt: styledPrompt,
        model: model
      }));

      return formattedResults;

    } catch (error) {
      console.error("Error in textToImage:", error);
      throw error;
    }
  }

  // Image to Image generation
  static async imageToImage(imageFile, prompt, model = "stability-ai/sdxl", styles = []) {
    try {
      // First upload the image to Supabase storage to get a public URL
      const filePath = `ai-inputs/${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('ai-assets')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL of the uploaded image
      const { data: urlData } = supabase
        .storage
        .from('ai-assets')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // Add style modifiers to the prompt if any styles are selected
      let styledPrompt = prompt;
      if (styles.length > 0) {
        styledPrompt += `, ${styles.join(", ")} style`;
      }

      // Model-specific parameters
      const modelParams = {
        "stability-ai/sdxl": {
          version: "da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf",
          input: {
            prompt: styledPrompt,
            image: imageUrl,
            num_outputs: 4,
            prompt_strength: 0.8,
            num_inference_steps: 50
          }
        },
        "stability-ai/stable-diffusion": {
          version: "f178fa7a1ae43a9a9af01b833b9d2ecf97b1bcb0acfd2dc5dd04895e042863f1",
          input: {
            prompt: styledPrompt,
            image: imageUrl,
            num_outputs: 4,
            num_inference_steps: 50,
            guidance_scale: 7.5
          }
        }
      };

      // Get the selected model configuration
      const selectedModel = modelParams[model] || modelParams["stability-ai/sdxl"];

      // Make the API call to Replicate
      const response = await fetch(REPLICATE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
        },
        body: JSON.stringify({
          version: selectedModel.version,
          input: selectedModel.input
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const prediction = await response.json();

      // Poll for results
      const result = await this.pollForResults(prediction.id);

      // Format the results for our application
      const formattedResults = result.output.map((url, index) => ({
        id: `${prediction.id}-${index}`,
        imageUrl: url,
        prompt: styledPrompt,
        model: model,
        sourceImage: imageUrl
      }));

      return formattedResults;

    } catch (error) {
      console.error("Error in imageToImage:", error);
      throw error;
    }
  }

  // Poll the Replicate API for prediction results
  static async pollForResults(predictionId, interval = 1000, timeout = 30000) {
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          // Check if timeout has been reached
          if (Date.now() - startTime > timeout) {
            reject(new Error("Prediction timed out"));
            return;
          }

          // Make request to get prediction status
          const response = await fetch(`${REPLICATE_API_URL}/${predictionId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${REPLICATE_API_TOKEN}`,
            },
          });

          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }

          const prediction = await response.json();

          // If prediction is complete, return the results
          if (prediction.status === "succeeded") {
            resolve(prediction);
            return;
          }

          // If prediction failed, throw an error
          if (prediction.status === "failed") {
            reject(new Error(prediction.error || "Prediction failed"));
            return;
          }

          // If still processing, check again after interval
          setTimeout(checkStatus, interval);

        } catch (error) {
          reject(error);
        }
      };

      // Start polling
      checkStatus();
    });
  }

  // Get previous generations from Supabase
  static async getPreviousGenerations(userId) {
    try {
      const { data, error } = await supabase
        .from('ai_generations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Flatten all results into a single array
      const allResults = data.flatMap(generation => 
        generation.results.map(result => ({
          ...result,
          created_at: generation.created_at
        }))
      );

      return allResults;

    } catch (error) {
      console.error("Error getting previous generations:", error);
      throw error;
    }
  }
}

export default ReplicateService;