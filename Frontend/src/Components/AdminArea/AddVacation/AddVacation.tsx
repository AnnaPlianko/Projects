import { useForm } from "react-hook-form";
import "./AddVacation.css";
import { useNavigate } from "react-router-dom";
import type { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";

// Form page for creating a new vacation and submitting it to the backend.
export function AddVacation() {
    const { register, handleSubmit, watch } = useForm<VacationModel>();
    const navigate = useNavigate();

    const today = new Date().toISOString().split("T")[0];
    const startDate = watch("startDate");

    // Called when the form is submitted successfully by react-hook-form.
    async function send(vacation: VacationModel) {
        try {
            await vacationService.addVacation(vacation);
            notify.success("Vacation has been added");
            navigate("/admin");
        } catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="AddVacation Box">
            <h2>Add New Vacation</h2>
            <form onSubmit={handleSubmit(send)}>

                <label>Destination:</label>
                <input type="text" {...register("destination")} minLength={2} maxLength={50} required />

                <label>Description:</label>
                <textarea {...register("description")} minLength={2} maxLength={500} required rows={3} />

                <label>Start Date:</label>
                <input type="date" {...register("startDate")} min={today} required />

                <label>End Date:</label>
                <input type="date" {...register("endDate")} min={startDate || today} required />

                <label>Price ($):</label>
                <input type="number" {...register("price")} min="0" max="10000" step="0.01" required />

                <label>Image:</label>
                <input type="file" {...register("image")} required accept="image/*" />

                <div className="form-buttons">
                    <button type="submit">Add Vacation ✈️</button>
                    <button type="button" onClick={() => navigate("/admin")}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
