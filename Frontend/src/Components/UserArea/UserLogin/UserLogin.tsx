import { useForm } from "react-hook-form";
import "./UserLogin.css";
import { CredentialsModel } from "../../../Models/CredentialsModel";
import { notify } from "../../../Utils/Notify";
import { userService } from "../../../Services/UserService";
import { useNavigate } from "react-router-dom";

// Login page that authenticates user and stores token via service layer.
export function UserLogin() {
    const { register, handleSubmit } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    // Submits credentials and redirects to user vacations on success.
    async function send(credentials: CredentialsModel) {
        try {
            await userService.login(credentials);
            notify.success("Welcome, You Login now!");
            navigate("/vacations");
        }
        catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit(send)}>

                <label>Email:</label>
                <input type="email" {...register("email")} required />

                <label>Password:</label>
                <input type="password" {...register("password")} minLength={4} maxLength={100} required />

                <button type="submit">Login</button>

            </form>
        </div>
    );
}