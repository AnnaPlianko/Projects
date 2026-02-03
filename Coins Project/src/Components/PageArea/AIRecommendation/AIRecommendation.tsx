import "./AIRecommendation.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import { getCoinForAI } from "../../../Services/CoinService";
import { getAIRecommendation } from "../../../Services/AIservice";
import { AIRecommendationResultModel } from "../../../Models/AIRecommendationModel";

export function AIRecommendation() {

    const selectedCoins = useSelector(
        (state: AppState) => state.realTimeReports.selectedCoins
    );

    const coins = useSelector(
        (state: AppState) => state.coins
    );

    const [loadingCoin, setLoadingCoin] = useState<string | null>(null);
    const [result, setResult] =
        useState<AIRecommendationResultModel | null>(null);

    async function handleRecommendation(symbol: string) {

        const coin = coins.find(
            c => c.symbol?.toLowerCase() === symbol
        );

        if (!coin?.id) return;

        try {
            setLoadingCoin(symbol);
            setResult(null);

            const coinData = await getCoinForAI(coin.id);
            const aiResult = await getAIRecommendation(coinData);

            setResult(aiResult);

        } catch (err) {
            console.error(err);
            setResult({
                decision: "NO_BUY",
                explanation: "AI request failed"
            });
        } finally {
            setLoadingCoin(null);
        }
    }

    return (
        <div className="AIRecommendation">
            <h1>Crypto Recommendation</h1>

            {selectedCoins.map(symbol => (
                <button
                    key={symbol}
                    onClick={() => handleRecommendation(symbol)}
                    disabled={loadingCoin === symbol}
                >
                    {loadingCoin === symbol
                        ? "Analyzing..."
                        : `Analyze ${symbol.toUpperCase()}`}
                </button>
            ))}

            {result && (
                <div className={result.decision === "BUY" ? "buy" : "no-buy"}>
                    <h2>{result.decision}</h2>
                    <p>{result.explanation}</p>
                </div>
            )}
        </div>
    );
}
