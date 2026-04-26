import joi from "joi";
import { ValidationError } from "./errors";
import { UploadedFile } from "express-fileupload";

// vacation and database model for vacation data, including validation logic.
export class VacationModel {
    public id: number;
    public destination: string;
    public description: string;
    public startDate: Date;
    public endDate: Date;
    public price: number;
    public image: UploadedFile;
    public imageName: string;
    public imageUrl: string;
    public likesCount: number;
    public isLiked: boolean;
// Initializes a new VacationModel instance with provided data.
    constructor(vacation: VacationModel) {
        this.id = vacation.id;
        this.destination = vacation.destination;
        this.description = vacation.description;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = vacation.price;
        this.image = vacation.image;
        this.imageName = vacation.imageName;
        this.imageUrl = vacation.imageUrl;
        this.likesCount = vacation.likesCount;
        this.isLiked = vacation.isLiked;
    }

    // Joi schema for validating vacation data before database operations.
    private static schema = joi.object({
        id: joi.number().positive().optional().integer(),
        destination: joi.string().max(50).required(),
        description: joi.string().max(500).required(),
        startDate: joi.date().required(),
        endDate: joi.date().greater(joi.ref('startDate')).required(),
        price: joi.number().min(0).max(10000).required(),
        image: joi.optional(),
        imageName: joi.string().max(255).optional(),
        imageUrl: joi.string().max(255).optional(),
        likesCount: joi.number().min(0).optional(),
        isLiked: joi.boolean().optional()
    });

    // Validates vacation payload while allowing DB-computed fields.
    public validate(): void {
        const result = VacationModel.schema.validate(this, { allowUnknown: true });
        if (result.error) throw new ValidationError(result.error.message);
    }
}
