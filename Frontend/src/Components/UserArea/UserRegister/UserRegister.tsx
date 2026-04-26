import { useForm } from "react-hook-form";
import "./UserRegister.css";
import { UserModel } from "../../../Models/UserModel";
import { notify } from "../../../Utils/Notify";
import { userService } from "../../../Services/UserService";
import { NavLink, useNavigate } from "react-router-dom";

// Registration page for creating a new user account.
export function Register() {
    const { register, handleSubmit } = useForm<UserModel>();
    const navigate = useNavigate();

    // Sends registration details and redirects to vacations on success.
    async function send(user: UserModel) {
        try {
            await userService.register(user);
            notify.success(`Welcome ${user.firstName} ${user.lastName}!`);
            navigate("/vacations");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Register">
            <form onSubmit={handleSubmit(send)}>

                <h2>Register</h2>

                <label>First Name:</label>
                <input type="text" {...register("firstName")} required />

                <label>Last Name:</label>
                <input type="text" {...register("lastName")} required />

                <label>Email:</label>
                <input type="email" {...register("email")} required />

                <label>Password:</label>
                <input type="password" {...register("password")} minLength={4} maxLength={100} required />

                <button type="submit">Register</button>
                <button type="reset" className="clear-btn">Clear</button>

                <span className="login-link">
                    Already have an account? <NavLink to="/login">Login</NavLink>
                </span>

            </form>
        </div>
    );
}