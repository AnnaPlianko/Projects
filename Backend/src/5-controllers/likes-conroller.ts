import express, { Request, Response, Router } from "express";
import { likesService } from "../4-services/likes-service";
import { StatusCodes } from "../3-models/enum";
import { cyberMiddleware } from "../6-middleware/cyber-middleware";

// HTTP controller for like/unlike endpoints.
class LikesController {

    public router: Router = express.Router();
    public constructor() {
        this.router.post("/api/likes/:vacationId", cyberMiddleware.verifyUserOnly, this.addLike);
        this.router.delete("/api/likes/:vacationId", cyberMiddleware.verifyUserOnly, this.deleteLike);
    }

    // Adds a like for current authenticated user.
    public async addLike(request: Request, response: Response) {
        const userId = request.body.userId;
        const vacationId = +request.params.vacationId;

        const dbLike = await likesService.addLike(userId, vacationId);
        response.status(StatusCodes.CREATED).json(dbLike);
    }

    // Removes a like for current authenticated user.
    public async deleteLike(request: Request, response: Response) {
        const userId = request.body.userId;
        const vacationId = +request.params.vacationId;

        await likesService.removeLike(userId, vacationId);
        response.sendStatus(StatusCodes.NO_CONTENT);
    }
}

export const likesController = new LikesController();