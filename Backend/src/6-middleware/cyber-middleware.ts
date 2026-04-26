import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../3-models/errors";
import { cyber } from "../2-utils/cyber";

// Auth middleware for token validation and admin authorization.
class CyberMiddleware {

    // Reads and verifies bearer token, then returns payload for downstream checks.
    private getVerifiedPayload(request: Request): { id: number; roleId: number } {
        const authorization = request.headers.authorization;

        if (!authorization?.startsWith("Bearer ")) {
            throw new UnauthorizedError("Invalid or missing token.");
        }

        const token = authorization.substring(7);

        if (!cyber.verifyToken(token)) {
            throw new UnauthorizedError("Invalid or missing token.");
        }

        return cyber.getPayload(token) as { id: number; roleId: number };
    }

    // Validates bearer token and injects userId into request body.
    public verifyToken(request: Request, response: Response, next: NextFunction): void {
        try {
            const payload = this.getVerifiedPayload(request);
            request.body = { ...request.body, userId: payload.id, roleId: payload.roleId };
            next();
        } catch (err: any) {
            next(err);
        }
    }

    // Validates token and blocks admins from user-only actions (such as likes).
    public verifyUserOnly(request: Request, response: Response, next: NextFunction): void {
        try {
            const payload = this.getVerifiedPayload(request);

            if (payload.roleId === 1) {
                next(new UnauthorizedError("Admins are not allowed to perform this action."));
                return;
            }

            request.body = { ...request.body, userId: payload.id, roleId: payload.roleId };
            next();
        } catch (err: any) {
            next(err);
        }
    }

    // Validates bearer token and blocks non-admin users.
    public verifyAdmin(request: Request, response: Response, next: NextFunction): void {
        const authorization = request.headers.authorization;

        if (!authorization?.startsWith("Bearer ")) {
            next(new UnauthorizedError("Invalid or missing token."));
            return;
        }

        const token = authorization.substring(7);

        if (!cyber.verifyAdmin(token)) {
            next(new UnauthorizedError("You are not authorized to perform this action."));
            return;
        }

        next();
    }
}

export const cyberMiddleware = new CyberMiddleware();