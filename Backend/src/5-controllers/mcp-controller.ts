import express, { Request, Response, Router } from "express";
import { cyberMiddleware } from "../6-middleware/cyber-middleware";
import { dal } from "../2-utils/dal";

// AI controller that answers natural-language questions using DB context.
class MCPController {
    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/mcp/query", cyberMiddleware.verifyToken, this.query);
    }

    // Loads DB context, sends it to model, and returns generated answer.
    private async query(request: Request, response: Response) {
        const { question } = request.body;

        if (!question) {
            response.status(400).json({ error: "Question is required" });
            return;
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            response.status(500).json({ error: "AI service not configured" });
            return;
        }

        // Fetch DB context
        const vacations = await dal.execute(
            `select v.id, v.destination, v.description, v.startDate, v.endDate, v.price,
             count(l.vacationId) as likesCount
             from \`vacations-list\` v
             left join likes l on v.id = l.vacationId
             group by v.id
             order by v.startDate asc`,
            []
        ) as any[];

        const dbContext = JSON.stringify(vacations, null, 2);

        const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful assistant that answers questions about vacation data from a database. 
Today's date is ${new Date().toISOString().split('T')[0]}.
Here is the current vacation database in JSON format:\n${dbContext}\n
Answer questions concisely based only on this data. For dates, calculate based on today's date.`
                    },
                    {
                        role: "user",
                        content: question
                    }
                ],
                max_tokens: 600
            })
        });

        if (!aiResponse.ok) {
            const errText = await aiResponse.text();
            response.status(500).json({ error: "AI request failed: " + errText });
            return;
        }

        const data = await aiResponse.json() as any;
        const answer = data.choices?.[0]?.message?.content || "Could not generate an answer.";
        response.json({ answer });
    }
}

export const mcpController = new MCPController();
