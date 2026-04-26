import express, { Request, Response, Router } from "express";
import { cyberMiddleware } from "../6-middleware/cyber-middleware";

// AI endpoint controller for destination recommendations.
class AIController {
    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/ai/recommend", cyberMiddleware.verifyToken, this.recommend);
    }

    // Generates a concise travel recommendation via OpenAI API.
    private async recommend(request: Request, response: Response) {
        const { destination } = request.body;

        if (!destination) {
            response.status(400).json({ error: "Destination is required" });
            return;
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            response.status(500).json({ error: "AI service not configured" });
            return;
        }

        const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{
                    role: "user",
                    content: `Give me a short travel guide for a vacation to ${destination}. Include: top 3 attractions, best time to visit, local food to try, and 2 practical travel tips. Keep it friendly and concise (under 250 words).`
                }],
                max_tokens: 500
            })
        });

        if (!aiResponse.ok) {
            const errText = await aiResponse.text();
            response.status(500).json({ error: "AI request failed: " + errText });
            return;
        }

        const data = await aiResponse.json() as any;
        const recommendation = data.choices?.[0]?.message?.content || "No recommendation available.";
        response.json({ recommendation });
    }
}

export const aiController = new AIController();
