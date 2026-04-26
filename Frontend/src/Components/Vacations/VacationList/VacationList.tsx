import { useEffect, useState } from "react";
import { vacationService } from "../../../Services/VacationService";
import type { VacationModel } from "../../../Models/VacationModel";
import { VacationCard } from "../VacationCard/VacationCard";
import { notify } from "../../../Utils/Notify";
import "./VacationList.css";

// Filter types for vacation listing
type FilterType = "all" | "liked" | "active" | "upcoming";
const PAGE_SIZE = 9;

// Main vacations page with filtering, pagination, and like/delete state updates.
export function VacationList() {
    const [vacations, setVacations] = useState<VacationModel[]>([]); 
    const [filter, setFilter] = useState<FilterType>("all"); 
    const [page, setPage] = useState(1); 
    const [loading, setLoading] = useState(true); 

    // Load vacations once on mount and stop loading in both success/failure paths.
    useEffect(() => {
        vacationService.getVacations()
            .then(data => { setVacations(data); setLoading(false); })
            .catch(err => { notify.error(err); setLoading(false); });
    }, []);

    // Reset to first page whenever filter changes to avoid empty pagination pages.
    useEffect(() => { setPage(1); }, [filter]);

    const today = new Date();

    // Build filtered dataset based on selected mode.
    const filtered = vacations.filter(v => {
        const start = new Date(v.startDate!);
        const end = new Date(v.endDate!);
        switch (filter) {
            case "liked":    return v.isLiked;
            case "active":   return start <= today && end >= today;
            case "upcoming": return start > today;
            default:         return true;
        }
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Remove a deleted item from visible list.
    function handleDelete(id: number) {
        setVacations(prev => prev.filter(v => v.id !== id));
    }

    // Update like fields in the matching card after user action.
    function handleLikeChange(id: number, isLiked: boolean, likesCount: number) {
        setVacations(prev => prev.map(v =>
            v.id === id ? { ...v, isLiked, likesCount } : v
        ));
    }

    return (
        <div className="VacationList">
            <div className="list-header">
                <h2>Discover Your Next Vacation</h2>
                <p>Choose a filter and find the perfect trip for you.</p>
            </div>

            <div className="filters">
                <button className={filter === "all"      ? "active" : ""} onClick={() => setFilter("all")}>🌍 All</button>
                <button className={filter === "liked"    ? "active" : ""} onClick={() => setFilter("liked")}>❤️ My Liked</button>
                <button className={filter === "active"   ? "active" : ""} onClick={() => setFilter("active")}>✈️ Active Now</button>
                <button className={filter === "upcoming" ? "active" : ""} onClick={() => setFilter("upcoming")}>🔜 Upcoming</button>
            </div>

            {loading && <p className="loading-msg">Loading vacations...</p>}

            {!loading && filtered.length === 0 && (
                <p className="empty-msg">No vacations found for this filter.</p>
            )}

            <div className="vacation-grid">
                {paginated.map(v => (
                    <VacationCard
                        key={v.id}
                        vacation={v}
                        onDelete={handleDelete}
                        onLikeChange={handleLikeChange}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={page === i + 1 ? "active" : ""}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
                </div>
            )}
        </div>
    );
}
