import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { useSelector } from "react-redux";
import type { AppState } from "../../../Redux/AppState";
import type { UserModel } from "../../../Models/UserModel";

// Navigation menu rendered by authentication state and user role.
export function NavBar() {
    const user = useSelector<AppState, UserModel | null>(state => state.user);
    const isAdmin = user?.roleId === 1;

    return (
        <nav className="NavBar">
            {!user && <NavLink to="/home">Home</NavLink>}

            {!user && (
                <>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                </>
            )}

            {user && !isAdmin && (
                <>
                    <NavLink to="/vacations">Vacations</NavLink>
                    <NavLink to="/ai-recommendation">AI Recommendation</NavLink>
                    <NavLink to="/mcp-chat">MCP Chat</NavLink>
                </>
            )}

            {user && isAdmin && (
                <>
                    <NavLink to="/admin">Manage Vacations</NavLink>
                    <NavLink to="/admin/report">Reports</NavLink>
                    <NavLink to="/ai-recommendation">AI Recommendation</NavLink>
                    <NavLink to="/mcp-chat">MCP Chat</NavLink>
                </>
            )}
        </nav>
    );
}
