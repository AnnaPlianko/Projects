import { useState } from "react";
import axios from "axios";
import { appConfig } from "../../../Utils/AppConfig";
import { notify } from "../../../Utils/Notify";
import "./MCPChat.css";

type Message = { role: "user" | "assistant"; text: string };

// Chat page for asking natural-language questions about vacation database data.
export function MCPChat() {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const examples = [
        "How many active vacations are there right now?",
        "What is the average price of all vacations?",
        "Which upcoming vacations are in Europe?",
        "Which vacation has the most likes?",
    ];

    // Sends user question to MCP endpoint and appends both user and assistant messages.
    async function ask(q?: string) {
        const text = q || question.trim();
        if (!text) return;
        setMessages(prev => [...prev, { role: "user", text }]);
        setQuestion("");
        setLoading(true);
        
        // Send question to backend and append response as assistant message on success.
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post<{ answer: string }>(
                appConfig.mcpQueryUrl,
                { question: text },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(prev => [...prev, { role: "assistant", text: response.data.answer }]);
        } catch (err: any) {
            notify.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="MCPChat">
            <h2>💬 MCP — Database Assistant</h2>
            <p className="subtitle">Ask questions about vacation data in natural language</p>

            <div className="examples">
                <span>Try:</span>
                {examples.map((ex, i) => (
                    <button key={i} className="example-chip" onClick={() => ask(ex)}>{ex}</button>
                ))}
            </div>

            <div className="chat-window">
                {messages.length === 0 && (
                    <p className="empty-chat">Ask a question about your vacation database above ☝️</p>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.role}`}>
                        <span className="msg-icon">{msg.role === "user" ? "🧑" : "🤖"}</span>
                        <span className="msg-text">{msg.text}</span>
                    </div>
                ))}
                {loading && (
                    <div className="message assistant">
                        <span className="msg-icon">🤖</span>
                        <span className="msg-text typing">Thinking...</span>
                    </div>
                )}
            </div>

            <div className="input-row">
                <input
                    type="text"
                    placeholder="Ask about your vacation data..."
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !loading && ask()}
                    disabled={loading}
                />
                <button onClick={() => ask()} disabled={loading || !question.trim()}>
                    Send ➤
                </button>
            </div>
        </div>
    );
}
