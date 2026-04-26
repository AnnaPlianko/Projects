import axios from "axios";
import { UserModel } from "../Models/UserModel";
import { appConfig } from "../Utils/AppConfig";
import { jwtDecode } from "jwt-decode";
import { CredentialsModel } from "../Models/CredentialsModel";
import { store } from "../Redux/Store";
import { userSlice } from "../Redux/UserSlice";

interface JwtPayload {
    id: number;
    roleId: number;
    firstName: string;
    lastName: string;
}

// Decodes JWT payload into app user model shape.
function extractUser(token: string): UserModel {
    const payload = jwtDecode<JwtPayload>(token);
    return {
        id: payload.id,
        roleId: payload.roleId,
        firstName: payload.firstName,
        lastName: payload.lastName
    };
}

class UserService {
    // Restores session from localStorage token on app startup.
    public constructor() {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const dbUser = extractUser(token);
            store.dispatch(userSlice.actions.initUser(dbUser));
        } catch {
            localStorage.removeItem("token");
        }
    }

    // Registers user, saves token, and initializes Redux user state.
    public async register(user: UserModel): Promise<void> {
        const response = await axios.post(appConfig.userRegisterUrl, user);
        const token = response.data;
        localStorage.setItem("token", token);
        const dbUser = extractUser(token);
        store.dispatch(userSlice.actions.initUser(dbUser));
    }

    // Logs in user, saves token, and initializes Redux user state.
    public async login(credentials: CredentialsModel): Promise<void> {
        const response = await axios.post(appConfig.userLoginUrl, credentials);
        const token = typeof response.data === "string" ? response.data : response.data.token;// Handle both string and object responses for token
        localStorage.setItem("token", token);
        const dbUser = extractUser(token);
        store.dispatch(userSlice.actions.initUser(dbUser));
    }

    // Clears local token and Redux auth state.
    public logout(): void {
        localStorage.removeItem("token");
        store.dispatch(userSlice.actions.logoutUser());
    }
}

export const userService = new UserService();
