import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { VacationModel } from "../../../Models/VacationModel";
import type { UserModel } from "../../../Models/UserModel";
import type { AppState } from "../../../Redux/AppState";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import "./VacationCard.css";

type Props = {
    vacation: VacationModel;
    onDelete?: (id: number) => void;
    onLikeChange?: (id: number, isLiked: boolean, likesCount: number) => void;
};

// Reusable card for showing one vacation and handling like/admin actions.
export function VacationCard({ vacation, onDelete, onLikeChange }: Props) {
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const user = useSelector<AppState, UserModel | null>(state => state.user);
    const isAdmin = user?.roleId === 1;
    const navigate = useNavigate();


// Helper to format ISO date strings into a more readable format or show "N/A" if invalid.
    function formatDate(dateString?: string): string {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A";
        return date.toLocaleDateString("he-IL");
    }

   // Toggles like state for the vacation and updates parent component on success.
    async function toggleLike() {
        const vacationId = vacation.id;
        if (vacationId === undefined || isLikeLoading) return;
        const currentIsLiked = vacation.isLiked ?? false;
        const currentLikesCount = vacation.likesCount ?? 0;
        setIsLikeLoading(true);
        try {
            if (!currentIsLiked) {
                await vacationService.addLike(vacationId);
                onLikeChange?.(vacationId, true, currentLikesCount + 1);
            } else {
                await vacationService.removeLike(vacationId);
                onLikeChange?.(vacationId, false, Math.max(0, currentLikesCount - 1));
            }
        } catch (err: any) {
            notify.error(err);
        } finally {
            setIsLikeLoading(false);
        }
    }

    // Confirms and deletes vacation when admin presses delete.
    async function handleDelete() {
        if (!window.confirm(`Are you sure you want to delete "${vacation.destination}"?`)) return;
        try {
            await vacationService.deleteVacation(vacation.id!);
            notify.success("Vacation deleted");
            onDelete?.(vacation.id!);
        } catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="VacationCard">
            <img src={vacation.imageUrl} alt={vacation.destination} />
            <div className="card-body">
                <h3>{vacation.destination}</h3>
                <p className="description">{vacation.description}</p>
                <div className="dates">
                    <span>📅 {formatDate(vacation.startDate)} → {formatDate(vacation.endDate)}</span>
                </div>
                <div className="price-likes">
                    <span className="price">${vacation.price?.toLocaleString()}</span>
                    <span className="likes">❤️ {vacation.likesCount ?? 0}</span>
                </div>

                {!isAdmin && (
                    <button className={`like-btn ${vacation.isLiked ? "liked" : ""}`} onClick={toggleLike} disabled={isLikeLoading}>
                        {vacation.isLiked ? "💔 Unlike" : "❤️ Like"}
                    </button>
                )}

                {isAdmin && (
                    <div className="admin-actions">
                        <button className="edit-btn" onClick={() => navigate(`/admin/edit/${vacation.id}`)}>✏️ Edit</button>
                        <button className="delete-btn" onClick={handleDelete}>🗑️ Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
}
