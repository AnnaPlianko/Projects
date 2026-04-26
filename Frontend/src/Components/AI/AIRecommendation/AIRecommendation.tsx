import { useState } from "react";
import axios from "axios";
import { appConfig } from "../../../Utils/AppConfig";
import { notify } from "../../../Utils/Notify";
import "./AIRecommendation.css";

// User page for requesting AI travel tips by destination.
export function AIRecommendation() {
    const [destination, setDestination] = useState("");
    const [recommendation, setRecommendation] = useState("");
    const [loading, setLoading] = useState(false);

    // Sends destination to backend AI endpoint and stores the returned recommendation.
    async function getRecommendation() {
        if (!destination.trim()) {//
            notify.error("Please enter a destination");
            return;
        }
        setLoading(true);
        setRecommendation("");
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post<{ recommendation: string }>(
                appConfig.aiRecommendUrl,
                { destination },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRecommendation(response.data.recommendation);
        } catch (err: any) {
            notify.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="AIRecommendation">
            <h2>✈️ AI Travel Recommendation</h2>
            <p className="subtitle">Enter a destination and get personalized travel tips from AI</p>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="e.g. Paris, Tokyo, New York..."
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && getRecommendation()}
                />
                <button onClick={getRecommendation} disabled={loading}>
                    {loading ? "Loading..." : "Get Tips 🤖"}
                </button>
            </div>

            {loading && <div className="loading-spinner">🔍 Getting recommendations...</div>}

            {recommendation && (
                <div className="recommendation-box">
                    <h3>Recommendations for {destination}</h3>
                    <p>{recommendation}</p>
                </div>
            )}
        </div>
    );
}
