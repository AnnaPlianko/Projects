import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { coinsSlice } from "./CoinsSlice";
import searchReducer from "./SearchSlice";
import { realTimeReportsReducer } from "./RealTimeReportsSlice";


export const store = configureStore<AppState>({
    reducer: {
        coins: coinsSlice.reducer,
        searchText: searchReducer,
        realTimeReports: realTimeReportsReducer

    }
});

