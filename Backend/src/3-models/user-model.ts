import joi from "joi";
import { ValidationError } from "./errors";
import { Role } from "./enum";

// DTO for user registration/login payload and persistence data.
export class UserModel {
    public id?: number;
    public firstName?: string;
    public lastName?: string;
    public email?: string;
    public password?: string;
    public roleId?: Role;

    public constructor(user: UserModel) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.roleId = user.roleId;
    }
    private static schema = joi.object({
        id: joi.number().positive().optional().integer(),
        firstName: joi.string().min(2).max(50).required(),
        lastName: joi.string().min(2).max(50).required(),
        email: joi.string().email().required(),
        password: joi.string().min(4).max(100).required(),
        roleId: joi.number().optional()
    });
// Validates the model instance against the defined schema.
    public validate(): void {
        const result = UserModel.schema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }
}

