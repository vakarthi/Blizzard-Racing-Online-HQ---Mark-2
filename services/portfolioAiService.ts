
import { GoogleGenAI, Type } from "@google/genai";
import { AppStore } from "./stateSyncService";
import { PortfolioAuditReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * PortfolioAiService: Uses Gemini 3 Pro to analyze team data against 
 * official F1 in Schools marking rubrics.
 */
export const portfolioAiService = {
  analyzeTeamReadiness: async (store: AppStore): Promise<PortfolioAuditReport> => {
    // Sanitize data for the prompt (remove large blobs/FBX data)
    const sanitizedStore = {
      ...store,
      publicPortalContentHistory: store.publicPortalContentHistory.map(v => ({
          ...v,
          content: { ...v.content, car: { ...v.content.car, carModelFbx: null } }
      })),
      aeroResults: store.aeroResults.slice(0, 5), // Only check recent simulations
    };

    const prompt = `
      You are an expert official judge for the F1 in Schools Development Class STEM competition.
      Analyze the provided team data from the "Blizzard Racing HQ" management platform.
      
      Evaluate the following pillars based on the current data:
      1. Project Management (Task completion, roles, synchronization).
      2. Design & Engineering (CFD data, iteration, technical depth in academy documentation).
      3. Enterprise (Sponsorship status, news consistency, public outreach).
      4. Team Identity (Bio professionalism, brand consistency).
      
      Data to analyze: ${JSON.stringify(sanitizedStore)}
      
      Return a critical, professional audit report that identifies exactly where marks might be lost and where the team is currently excelling.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              timestamp: { type: Type.STRING },
              overallReadiness: { type: Type.NUMBER },
              categories: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    feedback: { type: Type.STRING },
                    missingEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["title", "score", "feedback", "missingEvidence", "strengths"]
                }
              },
              criticalRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["timestamp", "overallReadiness", "categories", "criticalRisks", "suggestedActions"]
          }
        }
      });

      const report = JSON.parse(response.text || "{}") as PortfolioAuditReport;
      return report;
    } catch (error) {
      console.error("Gemini Audit Failed:", error);
      throw new Error("Failed to generate portfolio audit. Check API connection.");
    }
  }
};
