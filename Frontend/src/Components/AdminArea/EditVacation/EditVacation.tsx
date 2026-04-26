import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import type { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import "./EditVacation.css";

// Form page for editing an existing vacation by id.
export function EditVacation() {
    const { register, handleSubmit, setValue, watch } = useForm<VacationModel>();
    const navigate = useNavigate();
    const params = useParams();
    const id = Number(params.vacationId);
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [currentImageName, setCurrentImageName] = useState("");

    const startDate = watch("startDate");

    // On first render (or id change), load existing values into the form.
    useEffect(() => {
        vacationService.getOneVacation(id)
            .then(vacation => {
                setValue("destination", vacation.destination!);
                setValue("description", vacation.description!);
                // Format date to YYYY-MM-DD for input
                setValue("startDate", vacation.startDate!.toString().split("T")[0]);
                setValue("endDate", vacation.endDate!.toString().split("T")[0]);
                setValue("price", vacation.price!);
                setCurrentImageUrl(vacation.imageUrl || "");
                setCurrentImageName(vacation.imageUrl?.split("/").pop() || "");
            })
            .catch(err => notify.error(err));
    }, [id]);

    // Submit edited fields to backend and return to admin list on success.
    async function send(vacation: VacationModel) {
        try {
            vacation.id = id;
            await vacationService.editVacation(vacation);
            notify.success("Vacation has been updated");
            navigate("/admin");
        } catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="EditVacation Box">
            <h2>Edit Vacation</h2>
            <form onSubmit={handleSubmit(send)}>

                <label>Destination:</label>
                <input type="text" {...register("destination")} minLength={2} maxLength={50} required />

                <label>Description:</label>
                <textarea {...register("description")} minLength={2} maxLength={500} required rows={3} />

                <label>Start Date:</label>
                <input type="date" {...register("startDate")} required />

                <label>End Date:</label>
                <input type="date" {...register("endDate")} min={startDate} required />

                <label>Price ($):</label>
                <input type="number" {...register("price")} min="0" max="10000" step="0.01" required />

                {currentImageUrl && (
                    <>
                        <label>Current image:</label>
                        <img
                            src={currentImageUrl}
                            alt={currentImageName || "Current vacation"}
                            style={{ width: "100%", maxHeight: "220px", objectFit: "cover", borderRadius: "10px" }}
                        />
                    </>
                )}

                <label>Image (optional — leave empty to keep current):</label>
                <input type="file" {...register("image")} accept="image/*" />

                <div className="form-buttons">
                    <button type="submit">Update Vacation ✔️</button>
                    <button type="button" onClick={() => navigate("/admin")}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
