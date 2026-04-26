// Frontend API endpoints configuration.
class AppConfig {
    public readonly baseUrl = import.meta.env.VITE_API_URL || "/api";
    public readonly vacationsUrl = `${this.baseUrl}/vacations-list`;
    public readonly usersUrl = `${this.baseUrl}/users`;
    public readonly userRegisterUrl = `${this.baseUrl}/register`;
    public readonly userLoginUrl = `${this.baseUrl}/login`;
    public readonly likesUrl = `${this.baseUrl}/likes`;
    public readonly aiRecommendUrl = `${this.baseUrl}/ai/recommend`;
    public readonly mcpQueryUrl = `${this.baseUrl}/mcp/query`;
    public readonly reportUrl = `${this.baseUrl}/vacations-list/report`;
    public readonly csvUrl = `${this.baseUrl}/vacations-list/csv`;
}

export const appConfig = new AppConfig();
