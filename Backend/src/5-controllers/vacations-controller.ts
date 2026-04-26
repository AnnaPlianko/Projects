import express, { Request, Response, Router } from "express";
import { vacationsService } from "../4-services/vacations-service";
import { VacationModel } from "../3-models/vacation-model";
import { StatusCodes } from "../3-models/enum";
import { fileSaver } from "uploaded-file-saver";
import { cyberMiddleware } from "../6-middleware/cyber-middleware";

// Vacation endpoints controller for user/admin operations.
class VacationController {
    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/vacations-list", cyberMiddleware.verifyToken, this.getAllVacations);
        this.router.get("/api/vacations-list/report", cyberMiddleware.verifyAdmin, this.getReport);
        this.router.get("/api/vacations-list/csv", cyberMiddleware.verifyAdmin, this.getCSV);
        this.router.get("/api/vacations-list/:id", cyberMiddleware.verifyToken, this.getOneVacation);
        this.router.post("/api/vacations-list", cyberMiddleware.verifyAdmin, this.addVacation);
        this.router.put("/api/vacations-list/:id", cyberMiddleware.verifyAdmin, this.updateVacation);
        this.router.delete("/api/vacations-list/:id", cyberMiddleware.verifyAdmin, this.deleteVacation);
        this.router.get("/api/vacations-list/images/:image", this.getImage);
    }

    // Returns vacations list enriched with likes data for current user.
    private async getAllVacations(request: Request, response: Response) {
        const userId = request.body.userId || 0;
        const vacations = await vacationsService.getAllVacations(userId);
        response.json(vacations);
    }

    // Returns one vacation by route id.
    private async getOneVacation(request: Request, response: Response) {
        const id = +request.params.id;
        const vacation = await vacationsService.getOneVacation(id);
        response.json(vacation);
    }

    // Creates a vacation with optional uploaded image.
    private async addVacation(request: Request, response: Response) {
        request.body.image = request.files?.image;
        const vacation = new VacationModel(request.body);
        const dbVacation = await vacationsService.addVacation(vacation);
        response.status(StatusCodes.CREATED).json(dbVacation);
    }

    // Updates vacation fields by id and optional image.
    private async updateVacation(request: Request, response: Response) {
        request.body.image = request.files?.image;
        const id = +request.params.id;
        const vacation = new VacationModel(request.body);
        vacation.id = id;
        const dbVacation = await vacationsService.updateVacation(vacation);
        response.json(dbVacation);
    }

    // Deletes vacation by id.
    private async deleteVacation(request: Request, response: Response) {
        const id = +request.params.id;
        await vacationsService.deleteVacation(id);
        response.sendStatus(StatusCodes.NO_CONTENT);
    }

    // Returns aggregated report data for admin dashboards.
    private async getReport(request: Request, response: Response) {
        const data = await vacationsService.getVacationsForReport();
        response.json(data);
    }

    // Streams CSV export response for admin downloads.
    private async getCSV(request: Request, response: Response) {
        const csv = await vacationsService.getVacationsCSV();
        response.header("Content-Type", "text/csv");
        response.header("Content-Disposition", "attachment; filename=\"vacations.csv\"");
        response.send(csv);
    }

    // Serves saved image file by image name.
    private async getImage(request: Request, response: Response) {
        const imageName = request.params.image.toString();
        const imagePath = fileSaver.getFilePath(imageName);
        response.sendFile(imagePath);
    }
}

export const vacationController = new VacationController();
