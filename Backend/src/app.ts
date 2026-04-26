import express from "express";
import { appConfig } from "./2-utils/app-config";
import { vacationController } from "./5-controllers/vacations-controller";
import { userController } from "./5-controllers/user-controller";
import { errorMiddleware } from "./6-middleware/error-middleware";
import expressFileupload from "express-fileupload";
import { fileSaver } from "uploaded-file-saver";
import path from "path";
import cors from "cors";
import { likesController } from "./5-controllers/likes-conroller";
import { aiController } from "./5-controllers/ai-controller";
import { mcpController } from "./5-controllers/mcp-controller";

// Express app bootstrapper: wires middleware, routers, and startup.
class App {
    public start(): void {
        const server = express();

        server.use(express.json());
        server.use(cors());
        server.use(expressFileupload());

        const imageLocation = path.join(__dirname, "1-assets", "images");
        fileSaver.config(imageLocation);

        server.use(vacationController.router);
        server.use(userController.router);
        server.use(likesController.router);
        server.use(aiController.router);
        server.use(mcpController.router);

        server.use(errorMiddleware.routeNotFound);
        server.use(errorMiddleware.catchAll);

        // Start HTTP server on configured port.
        server.listen(appConfig.port, () => console.log("Listening on port:", appConfig.port));
    }
}

const app = new App();
app.start();
