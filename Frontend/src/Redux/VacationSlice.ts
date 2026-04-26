import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { VacationModel } from "../Models/VacationModel";

// Stores vacations collection and exposes immutable CRUD reducers.

// Init vacations reducer: 
function initVacations(_currentState: VacationModel[], action: PayloadAction<VacationModel[]>): VacationModel[] {
    const vacationsToInit = action.payload; // Get vacations to init.
    const newState = vacationsToInit; // New state is the vacations to init.
    return newState; // Return the new state.
}

// Add vacation reducer: 
function addVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {
    const vacationToAdd = action.payload; // Get the vacation to add.
    const newState = [...currentState]; // Duplicating currentState.
    newState.push(vacationToAdd); // Add the vacation.
    return newState; // Return the new state.
}

// Update vacation reducer: 
function updateVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {
    const vacationToUpdate = action.payload; // Get the vacation to update.
    const newState = [...currentState]; // Duplicating currentState.
    const index = newState.findIndex(v => v.id === vacationToUpdate.id); // Find index to update (-1 if not found)
    if (index >= 0) {
        newState[index] = vacationToUpdate; // Update.
    }
    return newState; // Return the new state.
}

// Delete vacation reducer: 
function deleteVacation(currentState: VacationModel[], action: PayloadAction<number>): VacationModel[] {
    const idToDelete = action.payload; // Get the vacation id to delete.
    const newState = [...currentState]; // Duplicating currentState.
    const index = newState.findIndex(v => v.id === idToDelete); // Find index to delete (-1 if not found).
    if (index >= 0) {
        newState.splice(index, 1); // Delete from index one item.
    }
    return newState; // Return the new state.
}

// Vacation slice: 
export const vacationSlice = createSlice({
    name: "vacation-slice",
    initialState: [] as VacationModel[],
    reducers: { initVacations, addVacation, updateVacation, deleteVacation }
});

export const { initVacations: initVacationsAction, addVacation: addVacationAction, updateVacation: updateVacationAction, deleteVacation: deleteVacationAction } = vacationSlice.actions;
export default vacationSlice.reducer;
