import { useNavigate } from "react-router-dom";
import "./Home.css";

// Landing page with quick navigation to authentication screens.
export function Home() {
    const navigate = useNavigate();

    return (
        <div className="Home">
            <h2>Welcome to Vacation App ✈️</h2>

            <div className="home-buttons">
                <button onClick={() => navigate("/login")}>Login</button>
                <button onClick={() => navigate("/register")}>Register</button>
            </div>
        </div>
    );
}