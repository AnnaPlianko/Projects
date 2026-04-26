import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home } from "../../LayoutArea/Home/Home";
import { UserLogin } from "../../UserArea/UserLogin/UserLogin";
import { Register } from "../../UserArea/UserRegister/UserRegister";
import { VacationList } from "../../Vacations/VacationList/VacationList";
import { AdminPage } from "../../AdminArea/AdminPage/AdminPage";
import { AddVacation } from "../../AdminArea/AddVacation/AddVacation";
import { EditVacation } from "../../AdminArea/EditVacation/EditVacation";
import { VacationReport } from "../../AdminArea/VacationReport/VacationReport";
import { AIRecommendation } from "../../AI/AIRecommendation/AIRecommendation";
import { MCPChat } from "../../MCP/MCPChat/MCPChat";
import type { AppState } from "../../../Redux/AppState";
import type { UserModel } from "../../../Models/UserModel";
import "./Routing.css";

// Central route table with role-based guards for user/admin pages.
export function Routing() {
    const user = useSelector<AppState, UserModel | null>(state => state.user);
    const isAdmin = user?.roleId === 1;

    return (
        <div className="Routing">
            <Routes>
                <Route path="/"           element={<Home />} />
                <Route path="/home"       element={<Home />} />
                <Route path="/login"      element={<UserLogin />} />
                <Route path="/register"   element={<Register />} />

                {/* User routes */}
                <Route path="/vacations"        element={user && !isAdmin ? <VacationList /> : <Navigate to={user ? "/admin" : "/login"} />} />
                <Route path="/ai-recommendation" element={user ? <AIRecommendation /> : <Navigate to="/login" />} />
                <Route path="/mcp-chat"          element={user ? <MCPChat /> : <Navigate to="/login" />} />

                {/* Admin routes */}
                <Route path="/admin"                    element={isAdmin ? <AdminPage />    : <Navigate to="/login" />} />
                <Route path="/admin/add"                element={isAdmin ? <AddVacation />  : <Navigate to="/login" />} />
                <Route path="/admin/edit/:vacationId"   element={isAdmin ? <EditVacation /> : <Navigate to="/login" />} />
                <Route path="/admin/report"             element={isAdmin ? <VacationReport /> : <Navigate to="/login" />} />

                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </div>
    );
}
