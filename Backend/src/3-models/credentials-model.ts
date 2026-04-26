import { ValidationError } from "./errors";

import joi from "joi";

// Login DTO with validation rules.
export class CredentialsModel {
    public email!: string;
    public password!: string;       

    constructor(credentials: CredentialsModel) {
        this.email = credentials.email;
        this.password = credentials.password;
    }  
    
    
        private static schema = joi.object({
          
            
            email: joi.string().email().required(),
            password: joi.string().min(5).max(100).required(),
        });
    
        // Validates credentials payload before authentication query.
        public validate(): void {
            const result = CredentialsModel.schema.validate(this);
            if (result.error) throw new ValidationError(result.error.message);
        }
    }
    
    
