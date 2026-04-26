import joi from "joi";
import { ValidationError } from "./errors";


export class LikeModel {
    public userId!: number;
    public vacationId!: number;

    private static schema = joi.object({
        userId: joi.number().positive().required().integer(),
        vacationId: joi.number().positive().required().integer()
    });

    // Validates the model instance against the defined schema.
    public validate(): void {
        const result = LikeModel.schema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }
}