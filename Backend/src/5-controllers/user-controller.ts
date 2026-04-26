import express, { Request, Response, Router } from "express";
import { userService } from "../4-services/user-service";
import { UserModel } from "../3-models/user-model";
import { StatusCodes } from "../3-models/enum";
import { CredentialsModel } from "../3-models/credentials-model";

// Auth controller exposing register and login endpoints.
class UserController {
    // Create the router object:
    public router: Router = express.Router();


    //Register routes and their matching functions: 
    public constructor() {
        this.router.post("/api/register", this.register);
        this.router.post("/api/login", this.login);
    }

    //Register user:

    // Creates a new user and returns token payload response.
    private async register(request: Request, response: Response) {
        const user = new UserModel(request.body);// Create a UserModel instance from the request body
        const dbUser = await userService.register(user);//
        response.status(StatusCodes.CREATED).json(dbUser);
    }

    
    // Authenticates existing user and returns signed token.
    private async login(request: Request, response: Response) {
        const credentials = new CredentialsModel(request.body);
        const token = await userService.login(credentials);// Authenticate the user and get the token
        response.status(StatusCodes.OK).json({ token });
    }
 
}

export const userController = new UserController();