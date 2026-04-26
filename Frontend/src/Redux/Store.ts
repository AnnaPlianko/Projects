import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./UserSlice";
import { vacationSlice } from "./VacationSlice";

// Global Redux store composed from user and vacation slices.
export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        vacations: vacationSlice.reducer
        
    }
});