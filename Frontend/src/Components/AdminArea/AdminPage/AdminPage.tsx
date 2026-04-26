import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { vacationService } from "../../../Services/VacationService";
import type { VacationModel } from "../../../Models/VacationModel";
import { VacationCard } from "../../Vacations/VacationCard/VacationCard";
import { notify } from "../../../Utils/Notify";
import "./AdminPage.css";

const PAGE_SIZE = 9;

// Admin dashboard for managing vacations with pagination.
export function AdminPage() {
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load all vacations once, sort by newest id first, and stop loading state.
    useEffect(() => {
        vacationService.getVacations()
            .then(data => {
                const sortedVacations = [...data].sort((firstVacation, secondVacation) => (secondVacation.id ?? 0) - (firstVacation.id ?? 0));
                setVacations(sortedVacations);
                setPage(1);
                setLoading(false);
            })
            .catch(err => { notify.error(err); setLoading(false); });
    }, []);

    // Remove deleted vacation from local UI state without re-fetching all data.
    function handleDelete(id: number) {
        setVacations(prev => prev.filter(v => v.id !== id));
    }

    const totalPages = Math.max(1, Math.ceil(vacations.length / PAGE_SIZE));
    const paginated = vacations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="AdminPage">
            <div className="admin-header">
                <h2>Vacation Management</h2>
                <div className="admin-actions-bar">
                    <button className="btn-add" onClick={() => navigate("/admin/add")}>➕ Add Vacation</button>
                    <button className="btn-report" onClick={() => navigate("/admin/report")}>📊 Reports</button>
                    <button className="btn-csv" onClick={() => vacationService.downloadCSV()}>⬇️ Download CSV</button>
                </div>
            </div>

            {loading && <p className="loading-msg">Loading vacations...</p>}

            <div className="vacation-grid">
                {paginated.map(v => (
                    <VacationCard key={v.id} vacation={v} onDelete={handleDelete} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i + 1} className={page === i + 1 ? "active" : ""} onClick={() => setPage(i + 1)}>
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
                </div>
            )}
        </div>
    );
}
