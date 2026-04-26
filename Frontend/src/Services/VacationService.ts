import { appConfig } from "../Utils/AppConfig";
import { VacationModel } from "../Models/VacationModel";
import { store } from "../Redux/Store";
import { vacationSlice } from "../Redux/VacationSlice";
import axios from "axios";

// Builds Authorization header from persisted JWT token.
function getAuthHeader() {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
}

// Client-side API wrapper for vacations CRUD, likes, and CSV export.
class VacationService {

    // Gets vacations list for current user.
    public async getVacations(): Promise<VacationModel[]> {
        const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl, {
            headers: getAuthHeader()
        });
        return response.data;
    }

    // Gets one vacation by id.
    public async getOneVacation(id: number): Promise<VacationModel> {
        const response = await axios.get<VacationModel>(`${appConfig.vacationsUrl}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }

    // Creates a vacation (multipart/form-data) and updates store when list is loaded.
    public async addVacation(vacation: VacationModel): Promise<void> {
        const myFormData = new FormData();
        myFormData.append("destination", vacation.destination!);
        myFormData.append("description", vacation.description!);
        myFormData.append("startDate", vacation.startDate!);
        myFormData.append("endDate", vacation.endDate!);
        myFormData.append("price", vacation.price!.toString());
        if (vacation.image) {
            myFormData.append("image", (vacation.image as unknown as FileList)[0]);
        }
        const response = await axios.post<VacationModel>(appConfig.vacationsUrl, myFormData, {
            headers: getAuthHeader()
        });
        const dbVacation = response.data;
        if (store.getState().vacations.length > 0) {
            store.dispatch(vacationSlice.actions.addVacation(dbVacation));
        }
    }

    // Updates vacation data and syncs updated entity into Redux state.
    public async editVacation(vacation: VacationModel): Promise<void> {
        const myFormData = new FormData();
        myFormData.append("destination", vacation.destination!);
        myFormData.append("description", vacation.description!);
        myFormData.append("startDate", vacation.startDate!);
        myFormData.append("endDate", vacation.endDate!);
        myFormData.append("price", vacation.price!.toString());
        if (vacation.image && (vacation.image as unknown as FileList).length > 0) {
            myFormData.append("image", (vacation.image as unknown as FileList)[0]);
        }
        
        const response = await axios.put<VacationModel>(`${appConfig.vacationsUrl}/${vacation.id}`, myFormData, {
            headers: getAuthHeader()
        });
        const dbVacation = response.data;
        store.dispatch(vacationSlice.actions.updateVacation(dbVacation));
    }

    // Deletes vacation by id and removes it from Redux state.
    public async deleteVacation(id: number): Promise<void> {
        await axios.delete(`${appConfig.vacationsUrl}/${id}`, {
            headers: getAuthHeader()
        });
        store.dispatch(vacationSlice.actions.deleteVacation(id));
    }

    // Adds like relation for current user and vacation id.
    public async addLike(vacationId: number): Promise<void> {
        await axios.post(`${appConfig.likesUrl}/${vacationId}`, {}, {
            headers: getAuthHeader()
        });
    }

    // Removes like relation for current user and vacation id.
    public async removeLike(vacationId: number): Promise<void> {
        await axios.delete(`${appConfig.likesUrl}/${vacationId}`, {
            headers: getAuthHeader()
        });
    }

    // Downloads CSV with auth header using fetch blob flow.
    public downloadCSV(): void {
        const token = localStorage.getItem("token");
        const link = document.createElement("a");
        link.href = `${appConfig.csvUrl}`;
        link.setAttribute("download", "vacations.csv");
        // Use fetch to handle auth header
        fetch(appConfig.csvUrl, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            });
    }
}

export const vacationService = new VacationService();
