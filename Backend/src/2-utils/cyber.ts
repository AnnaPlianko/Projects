import { UserModel } from "../3-models/user-model";
import { SignOptions } from "jsonwebtoken";
import jwt from 'jsonwebtoken';
import { appConfig } from "./app-config";
import { Role } from "../3-models/enum";
import bcrypt from "bcryptjs";

// JWT helper for issuing tokens, verifying role-based access, and hashing passwords.
class Cyber {

    // Hashes a password using bcrypt for secure storage.
    public async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    // Compares a plain password against a bcrypt hash.
    public async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

   // Generates a signed JWT token with user info payload and expiration.
    public generateToken(user: UserModel): string {
        delete user.password;
        const payload = {
            id: user.id,
            roleId: user.roleId,
            firstName: user.firstName,
            lastName: user.lastName
        };

        const options: SignOptions = { expiresIn: "3h" };
        const token = jwt.sign(payload, appConfig.jwtSecretKey, options);// Sign the token with the secret key and options
        return token;
    }

    // Validates token signature and expiration.
    public verifyToken(token: string): boolean {
        try {
            if (!token) return false;
            jwt.verify(token, appConfig.jwtSecretKey);
            return true;
            
        } catch {
            return false;
        }
    }

    // Validates token and ensures payload role is admin.
    public verifyAdmin(token: string): boolean {
        try {
            if (!token) return false;
            jwt.verify(token, appConfig.jwtSecretKey);
            const payload = jwt.decode(token) as { id: number, roleId: Role };
            return payload.roleId === Role.Admin;
        } catch {
            return false;
        }
    }

    // Returns decoded and verified payload.
    public getPayload(token: string): any {
        return jwt.verify(token, appConfig.jwtSecretKey);
    }
}

export const cyber = new Cyber();
