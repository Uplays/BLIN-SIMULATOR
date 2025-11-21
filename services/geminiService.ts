import { GoogleGenAI } from "@google/genai";

interface AnalyzeImageParams {
  base64Image: string;
  mimeType: string;
  prompt: string;
}

// Global variable to store the GoogleGenAI instance.
// It will be initialized once the API key is confirmed.
let aiInstance: GoogleGenAI | null = null;

const getGeminiClient = () => {
  if (!aiInstance) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY is not set in environment variables.');
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const analyzeImage = async ({ base64Image, mimeType, prompt }: AnalyzeImageParams): Promise<string | undefined> => {
  try {
    const ai = getGeminiClient();
    
    // Ensure the model chosen is appropriate for image understanding with advanced capabilities.
    // 'gemini-3-pro-preview' is recommended for complex reasoning and multimodal tasks.
    const modelName = 'gemini-3-pro-preview';

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        // Optional: you can add other generation configurations here
        temperature: 0.4,
        topK: 32,
        topP: 1,
      },
    });

    return response.text;
  } catch (error: any) {
    console.error('Error analyzing image with Gemini API:', error);
    // Check for specific error messages related to API key or quota
    if (error.message.includes("API_KEY_INVALID") || error.message.includes("billing")) {
      console.error("Please ensure your API key is valid and linked to a paid project.");
      // If window.aistudio is available (in the AI Studio environment), prompt user to select API key
      if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
        console.log("Attempting to re-select API key...");
        await (window as any).aistudio.openSelectKey();
        // Assume successful selection and create new instance for subsequent calls
        aiInstance = null; // Clear previous instance
      }
      throw new Error("API Key issue: Please check your API key and billing status. You may need to select a new key.");
    } else if (error.message.includes("Requested entity was not found.")) {
      // This is a specific error that sometimes indicates an API key problem after selection.
      console.error("Requested entity not found, likely due to an API key or permission issue.");
      if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
        console.log("Attempting to re-select API key...");
        await (window as any).aistudio.openSelectKey();
        aiInstance = null;
      }
      throw new Error("API Key or Model Access Issue: Please try re-selecting your API key.");
    }
    throw new Error(`Failed to analyze image: ${error.message || 'Unknown error'}`);
  }
};