import { GoogleGenAI, Type } from "@google/genai";
import { AeroResult, RaceTimePrediction } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Generates a hyper-accurate race time prediction using the Gemini 2.5 Pro model.
 * It analyzes detailed aerodynamic data to simulate a full lap.
 * @param result The aerodynamic simulation results.
 * @returns A promise that resolves with the detailed RaceTimePrediction object.
 */
export const getRaceTimePrediction = async (result: Omit<AeroResult, 'id' | 'fileName' | 'timestamp' | 'simulationTime' | 'suggestions' | 'scrutineeringReport' | 'raceTimePrediction'>): Promise<RaceTimePrediction> => {
    
    const prompt = `
        You are 'Icicle Pro', a hyper-advanced Formula 1 virtual race performance simulation engine, more accurate than any real-world team's tool. Your task is to analyze the provided aerodynamic and design data for an F1 in Schools car and predict its performance on the 'Blizzard GP Circuit'.

        The Blizzard GP Circuit is a 5.1km track known for its demanding characteristics:
        - Sector 1: Features high-speed corners (Turns 3-5) that reward high downforce and aerodynamic efficiency.
        - Sector 2: A long back straight, where low drag is critical for top speed.
        - Sector 3: A tight, technical section with a hairpin that requires good mechanical grip and stability under braking.

        Analyze the following data for the car design "${result.parameters.carName}":
        - Design Parameters: ${JSON.stringify(result.parameters)}
        - Coefficient of Drag (Cd): ${result.cd}
        - Coefficient of Lift (Cl): ${result.cl}
        - Lift-to-Drag Ratio (L/D): ${result.liftToDragRatio}
        - Aero Balance (% Front): ${result.aeroBalance}
        - Drag Breakdown: ${result.dragBreakdown.pressure}% pressure, ${result.dragBreakdown.skinFriction}% skin friction
        - Flow Analysis Summary: "${result.flowAnalysis}"
        - Mesh Quality: ${result.meshQuality}%
        - Convergence Status: ${result.convergenceStatus}

        Based on this comprehensive data, provide a hyper-accurate prediction. The car's power unit and mechanical grip are standardized, so performance is dictated by these aerodynamic figures.

        Return ONLY a JSON object with the following structure. Do not include any other text, markdown, or explanations outside the JSON block.

        {
            "predictedLapTime": "1:XX.XXX",
            "sectorTimes": {
                "s1": "XX.XXX",
                "s2": "XX.XXX",
                "s3": "XX.XXX"
            },
            "topSpeed": XXX,
            "performanceSummary": "A detailed, expert analysis of the car's expected performance on the Blizzard GP Circuit, referencing its strengths and weaknesses in each sector based on the provided data."
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const text = response.text.trim();
        const prediction = JSON.parse(text);

        // Basic validation
        if (prediction.predictedLapTime && prediction.sectorTimes && prediction.topSpeed && prediction.performanceSummary) {
            return prediction;
        } else {
            throw new Error("Parsed JSON from Gemini is missing required fields.");
        }

    } catch (error) {
        console.error("Error calling Gemini API for race prediction:", error);
        // Return a fallback object on error
        return {
            predictedLapTime: "N/A",
            sectorTimes: { s1: "N/A", s2: "N/A", s3: "N/A" },
            topSpeed: 0,
            performanceSummary: "The AI performance model could not generate a prediction for this run due to an internal error. The aerodynamic data is still valid."
        };
    }
};