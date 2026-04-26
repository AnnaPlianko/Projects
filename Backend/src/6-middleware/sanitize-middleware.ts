import { NextFunction, Request, Response } from "express";
import stripTags from "striptags";

// Middleware for sanitizing input data - removes HTML tags from all string values in req.body.
class SanitizeMiddleware {

    // Recursively sanitizes all string values in an object.
    private sanitizeObject(obj: any): any {
        if (obj === null || obj === undefined) return obj;
        
        if (typeof obj === "string") {
            return stripTags(obj).trim();
        }
        
        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item));
        }
        
        if (typeof obj === "object") {
            const sanitized: any = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    sanitized[key] = this.sanitizeObject(obj[key]);
                }
            }
            return sanitized;
        }
        
        return obj;
    }

    // Express middleware - sanitizes req.body before it reaches controllers.
    public sanitize(request: Request, response: Response, next: NextFunction): void {
        if (request.body && typeof request.body === "object") {
            request.body = this.sanitizeObject(request.body);
        }
        next();
    }
}

export const sanitizeMiddleware = new SanitizeMiddleware();
