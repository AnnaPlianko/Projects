import "./RealTimeReports.css";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import { appConfig } from "../../../Utils/AppConfig";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import axios from "axios";


const LINE_COLORS = ["#06b6d4", "#22c55e", "#f97316", "#a855f7", "#ef4444"];

export function RealTimeReports() {

    const selectedCoins = useSelector(
        (state: AppState) => state.realTimeReports.selectedCoins
    );

    const [data, setData] = useState<any[]>([]);
    const basePricesRef = useRef<Record<string, number>>({});

    useEffect(() => {
        if (selectedCoins.length === 0) {
            setData([]);
            basePricesRef.current = {};
            return;
        }

        Object.keys(basePricesRef.current).forEach(symbol => {
            if (!selectedCoins.includes(symbol)) {
                delete basePricesRef.current[symbol];
            }
        });

        const fetchPrices = async () => {
            try {
                const symbols = selectedCoins.join(",");

                const response = await axios.get(
                    appConfig.realTimePricesUrl + symbols
                );

                const prices = response.data;

                const point: any = {
                    time: new Date().toLocaleTimeString()
                };

                selectedCoins.forEach(symbol => {
                    const price = prices[symbol.toUpperCase()]?.USD;
                    if (!price) return;

                    if (!basePricesRef.current[symbol]) {
                        basePricesRef.current[symbol] = price;
                    }

                    const base = basePricesRef.current[symbol];

                    point[symbol] = ((price - base) / base) * 100;
                });

                setData(prev => [...prev.slice(-9), point]);
            }
            catch (error) {
                console.error("RealTimeReports error:", error);
            }
        };

        fetchPrices();
        const intervalId = setInterval(fetchPrices, 1000);

        return () => clearInterval(intervalId);

    }, [selectedCoins]);

    return (
        <div className="RealTimeReports">
            <h2 className="reports-title">Real Time Reports</h2>

            {selectedCoins.length === 0 && (
                <p className="reports-empty">
                    Please select coins to display the graph
                </p>
            )}

            {selectedCoins.length > 0 && (
                <div className="chart-wrapper">
                    <LineChart width={800} height={350} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />

                        <YAxis
                            domain={["auto", "auto"]}
                            tickFormatter={(value) => `${value.toFixed(2)}%`}
                        />

                        <Tooltip />
                        <Legend />

                        {selectedCoins.map((symbol, index) => (
                            <Line
                                key={symbol}
                                type="monotone"
                                dataKey={symbol}
                                stroke={LINE_COLORS[index]}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </div>
            )}
        </div>
    );
}
