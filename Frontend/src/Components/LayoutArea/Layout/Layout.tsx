import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../Header/Header";
import { NavBar } from "../NavBar/NavBar";
import { Routing } from "../Routing/Routing";
import { UserMenu } from "../../UserArea/UserMenu/UserMenu";
import { userService } from "../../../Services/UserService";
import { useSelector } from "react-redux";
import type { AppState } from "../../../Redux/AppState";
import type { UserModel } from "../../../Models/UserModel";
import "./Layout.css";

// Main shell that composes header, optional sidebar, and routed content.
export function Layout() {
    const location = useLocation();
    const isHomePage = location.pathname === "/" || location.pathname === "/home";
    const user = useSelector<AppState, UserModel | null>(state => state.user);
    const navigate = useNavigate();

    // Clears auth state and returns the user to the public home page.
    function logout() {
        userService.logout();
        navigate("/home");
    }

    return (
        <div className="Layout">
            <header className="app-header">
                <div className="header-left">
                    {user && (
                        <button className="header-logout-btn" onClick={logout}>
                            &#x2728; Logout
                        </button>
                    )}
                </div>
                <div className="header-center">
                    <Header />
                </div>
                <div className="header-right">
                    <UserMenu />
                </div>
            </header>

            {!isHomePage && (
                <aside>
                    <NavBar />
                </aside>
            )}

            <main>
                <Routing />
            </main>

            <footer>
            </footer>
        </div>
    );
}