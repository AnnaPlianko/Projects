import { Navigate, Route, Routes } from "react-router-dom";
import "./Routing.css";
import { Home } from "../../PageArea/Home/Home";
import { RealTimeReports } from "../../PageArea/RealTimeReports/RealTimeReports";
import { AIRecommendation } from "../../PageArea/AIRecommendation/AIRecommendation";
import { About } from "../../PageArea/About/About";

export function Routing() {
    return (
        <div className="Routing">
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/reports" element={<RealTimeReports />} />
                <Route path="/recommendation" element={<AIRecommendation />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </div>
    );
}
