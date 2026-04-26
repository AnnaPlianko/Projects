import "./UserMenu.css";
import { useSelector } from "react-redux";
import type { AppState } from "../../../Redux/AppState";
import { UserModel } from "../../../Models/UserModel";

// Small header widget showing the currently logged-in user name.
export function UserMenu() {
    const user = useSelector<AppState, UserModel | null>((state) => state.user);

    if (!user) return null;

    return (
        <div className="UserMenu">
            <span>Hello, <strong>{user.firstName} {user.lastName}</strong> ✈️</span>
        </div>
    );
}
