import { UserModel } from "../3-models/user-model";
import { dal } from "../2-utils/dal";
import { OkPacketParams } from "mysql2";
import { UnauthorizedError } from "../3-models/errors";
import { Role } from "../3-models/enum";
import { cyber } from "../2-utils/cyber";
import { CredentialsModel } from "../3-models/credentials-model";

// Business logic for user registration and login.
class UserService {

    // Registers a user, assigns default role, and returns auth token.
    public async register(user: UserModel): Promise<string> {
        user.validate();
        if (await this.checkUserExist(user)) throw new UnauthorizedError("Email already exists");
        user.roleId = Role.User;
        const sql = "insert into users (firstName, lastName, email, password, roleId) values (?, ?, ?, ?, ?)";
        const values = [user.firstName, user.lastName, user.email, user.password, user.roleId];
        const info: OkPacketParams = await dal.execute(sql, values) as OkPacketParams;
        //info.insertId is the new user's id generated automatically by the database
        user.id = info.insertId!;
        const token = cyber.generateToken(user);
        return token;
    }

    // Authenticates credentials and returns signed JWT token.
    public async login(credentials: CredentialsModel): Promise<string> {
        credentials.validate();
        const sql = "select * from users where email = ? and password = ?";
        const values = [credentials.email, credentials.password];
        const users = await dal.execute(sql, values) as UserModel[];//
        const user = users[0];//
        if (!user) throw new UnauthorizedError("Incorrect email or password");
        const token = cyber.generateToken(user);
        return token;
    }

    // Checks if user email already exists in database.
    private async checkUserExist(user: UserModel): Promise<boolean> {
        const sql = "select * from users where email = ?";
        const users = await dal.execute(sql, [user.email]) as UserModel[];
        return users.length > 0;// Returns true if a user with the given email already exists, false otherwise.
    }
}

export const userService = new UserService();
