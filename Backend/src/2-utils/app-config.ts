import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file at project root.
dotenv.config({ path: path.resolve(__dirname, "../../.env"), quiet: true });

// Centralized application configuration class that reads from environment variables.
class AppConfig {
    public readonly environment = process.env.ENVIRONMENT || process.env.NODE_ENV || "development";
    public readonly isDevelopment = this.environment === "development";
    public readonly isProduction = this.environment === "production";

    public readonly port = Number(process.env.PORT) || 4000;
    public readonly imageLocation = process.env.IMAGE_LOCATION || "/api/vacations-list/images/";
    public readonly mysqlHost = process.env.MYSQL_HOST;
    public readonly mysqlUser = process.env.MYSQL_USER;
    public readonly mysqlPassword = process.env.MYSQL_PASSWORD;
    public readonly mysqlDatabase = process.env.MYSQL_DATABASE;
    public readonly jwtSecretKey = process.env.JWT_SECRET_KEY!;


}


export const appConfig = new AppConfig();