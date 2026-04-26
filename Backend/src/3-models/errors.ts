import { StatusCodes } from "./enum";

// Base shape for client-facing errors with HTTP status and message.
abstract class ClientError {

    public status: StatusCodes;
    public message: string;

    public constructor(status: StatusCodes, message: string) {
        this.status = status;
        this.message = message;
    }
}
export class RouteNotFoundError extends ClientError{ 
        public constructor(route:string ,method:string) {
            super(StatusCodes.NOT_FOUND, `Route ${route} on method ${method} not found.`);
        }
    }   

// Thrown when an entity id is not found in storage.
export class ResourceNotFoundError extends ClientError {
    public constructor( id: number) {
        super(StatusCodes.NOT_FOUND, `id ${id} not found.`);
    }
}
export class ValidationError extends ClientError {
    public constructor(message: string) {
        super(StatusCodes.BAD_REQUEST, message);
    }
}

// Thrown when token or credentials are invalid.
export class UnauthorizedError extends ClientError {
    public constructor(message: string ) {
        super(StatusCodes.UNAUTHORIZED, message);
    }   
}