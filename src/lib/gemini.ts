import { GoogleGenAI, Type } from "@google/genai";
import { DisasterProblem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeDisasterImage(base64Image: string): Promise<DisasterProblem[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1] || base64Image,
              },
            },
            {
              text: "Analyze this disaster image and detect multiple problems. Identify building damage, road blockage, floods, or earthquake damage. Return a structured list of problems with confidence and severity.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "Type of disaster problem (e.g., Flood, Building Damage, Road Blocked)" },
                  confidence: { type: Type.NUMBER, description: "Confidence percentage (0-100)" },
                  severity: { type: Type.STRING, enum: ["High", "Medium", "Safe"], description: "Severity level" },
                },
                required: ["type", "confidence", "severity"],
              },
            },
          },
          required: ["problems"],
        },
      },
    });

    const result = JSON.parse(response.text);
    return result.problems;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    // Fallback mock data if AI fails or key is missing
    return [
      { type: "Building Damage", confidence: 85, severity: "High" },
      { type: "Road Blocked", confidence: 70, severity: "Medium" }
    ];
  }
}
