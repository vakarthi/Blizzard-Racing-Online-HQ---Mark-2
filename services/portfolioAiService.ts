
import { GoogleGenAI, Type } from "@google/genai";
import { AppStore } from "./stateSyncService";
import { PortfolioAuditReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * PortfolioAiService: Acts as a Lead F1 in Schools Judge.
 * Analyzes team state for 'Marking Points' specific to the Development Class.
 */
export const portfolioAiService = {
  analyzeTeamReadiness: async (store: AppStore): Promise<PortfolioAuditReport> => {
    const sanitizedStore = {
      ...store,
      publicPortalContentHistory: store.publicPortalContentHistory.map(v => ({
          ...v,
          content: { ...v.content, car: { ...v.content.car, carModelFbx: null } }
      })),
      aeroResults: store.aeroResults.slice(0, 3),
    };

    const prompt = `
      As a Senior Judge for the F1 in Schools Development Class, audit this team's data. 
      The rubric values: Iterative Design (showing failed tests), Project Lifecycle (Scrum/Agile), and Enterprise ROI.

      Search for these specific mark-winning indicators:
      1. Design Engineering: Are they comparing results? Do they mention 'Stability' or 'Center of Pressure'?
      2. Project Management: Are tasks assigned to roles like 'Manufacturing Engineer' or 'Resources Manager' appropriately?
      3. Enterprise: Is there evidence of sponsorship tiers and public engagement?
      4. Manufacturing: Is there evidence of physical testing or CNC/3D print optimization?

      Store Data: ${JSON.stringify(sanitizedStore)}

      Provide a critical, technical analysis. Be harsh but constructive to help them win Nationals.
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

      return JSON.parse(response.text || "{}") as PortfolioAuditReport;
    } catch (error) {
      console.error("Gemini Audit Failed:", error);
      throw new Error("Audit service unreachable.");
    }
  }
};
