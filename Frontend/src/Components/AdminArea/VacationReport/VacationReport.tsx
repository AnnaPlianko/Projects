import { useEffect, useState } from "react";
import axios from "axios";
import { appConfig } from "../../../Utils/AppConfig";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import "./VacationReport.css";

type ReportItem = { destination: string; likesCount: number };

// Admin report page that visualizes likes per destination.
export function VacationReport() {
    const [data, setData] = useState<ReportItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch report dataset once when the page mounts.
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get<ReportItem[]>(appConfig.reportUrl, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => { setData(r.data); setLoading(false); })
            .catch(err => { notify.error(err); setLoading(false); });
    }, []);

    if (loading) return <p className="loading-msg">Loading report...</p>;

    // Derived chart dimensions based on current dataset size and values.
    const maxLikes = Math.max(...data.map(d => d.likesCount), 1);
    const chartHeight = 280;
    const barWidth = Math.max(30, Math.min(60, Math.floor(680 / data.length) - 10));
    const chartWidth = data.length * (barWidth + 12) + 60;

    return (
        <div className="VacationReport">
            <div className="report-header">
                <h2>Vacation Insights: Likes per Destination</h2>
                <button className="csv-btn" onClick={() => vacationService.downloadCSV()}>
                    ⬇️ Download CSV
                </button>
            </div>

            {data.length === 0 && <p className="empty-msg">No data available.</p>}

            {data.length > 0 && (
                <div className="chart-container">
                    <svg width={chartWidth} height={chartHeight + 60} role="img" aria-label="Bar chart of vacation likes">
                        {/* Y-axis labels */}
                        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                            const y = chartHeight - pct * chartHeight;
                            const val = Math.round(pct * maxLikes);
                            return (
                                <g key={i}>
                                    <text x="40" y={y + 4} textAnchor="end" fontSize="11" fill="#6b7280">{val}</text>
                                    <line x1="46" y1={y} x2={chartWidth} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                                </g>
                            );
                        })}

                        {/* Bars */}
                        {data.map((item, i) => {
                            const barH = Math.max(4, (item.likesCount / maxLikes) * chartHeight);
                            const x = 50 + i * (barWidth + 12);
                            const y = chartHeight - barH;
                            return (
                                <g key={item.destination}>
                                    <rect x={x} y={y} width={barWidth} height={barH} rx="7" fill="url(#barGradient)" />
                                    <text x={x + barWidth / 2} y={y - 7} textAnchor="middle" fontSize="11" fill="#0f172a" fontWeight="700">
                                        {item.likesCount}
                                    </text>
                                    <text
                                        x={x + barWidth / 2}
                                        y={chartHeight + 18}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="#374151"
                                        transform={`rotate(-30, ${x + barWidth / 2}, ${chartHeight + 18})`}
                                    >
                                        {item.destination.length > 10 ? item.destination.slice(0, 10) + "…" : item.destination}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Y axis line */}
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#48cae4" />
                                <stop offset="100%" stopColor="#0077b6" />
                            </linearGradient>
                        </defs>
                        <line x1="46" y1="0" x2="46" y2={chartHeight} stroke="#cbd5e1" strokeWidth="1" />
                    </svg>
                </div>
            )}

            <table className="report-table">
                <thead>
                    <tr><th>Destination</th><th>Likes</th></tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.destination}>
                            <td>{item.destination}</td>
                            <td>❤️ {item.likesCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
