import { NextFunction, Request, Response } from "express";
import { RouteNotFoundError } from "../3-models/errors";
import { StatusCodes } from "../3-models/enum";
import { appConfig } from "../2-utils/app-config";


// Central error and not-found handling for Express pipeline.
class ErrorMiddleware {
    // Catch all errors:
    public catchAll(err: any, request: Request, response: Response, next: NextFunction) {

        console.error(err);
        const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
        // In production, hide server errors details:
        const isServerError = status >= 500 && status <= 599;
        const message = isServerError && appConfig.isProduction ? "Sorry, something went wrong. Please try again." : err.message;

        response.status(status).send(message);
    }
    //
    // Converts unmatched routes to a typed not-found error.
    public routeNotFound(request: Request, response: Response, next: NextFunction) {
        next(new RouteNotFoundError(request.originalUrl, request.method));

    }
}
export const errorMiddleware = new ErrorMiddleware();