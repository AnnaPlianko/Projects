import axios from "axios";
import { appConfig } from "../Utils/AppConfig";
import {
    AIAnswerModel,
    AIRecommendationResultModel
} from "../Models/AIRecommendationModel";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function getAIRecommendation(
    coinData: AIAnswerModel
): Promise<AIRecommendationResultModel> {

    const prompt = `
        You are a professional crypto investment analyst.

        Coin data:
        ${JSON.stringify(coinData, null, 2)}

        Answer in JSON only with this structure:
        {
        "decision": "BUY" or "NO_BUY",
        "explanation": "short explanation"
        }
        `;

    const response = await axios.post(
        appConfig.openAiUrl,
        {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3
        },
        {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        }
    );

    return JSON.parse(
        response.data.choices[0].message.content
    );
}
