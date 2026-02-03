import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RealTimeReportsState = {
    selectedCoins: string[];
    pendingCoin: string | null;
    showDialog: boolean;
};

const initialState: RealTimeReportsState = {
    selectedCoins: [],
    pendingCoin: null,
    showDialog: false
};

const realTimeReportsSlice = createSlice({
    name: "realTimeReports",
    initialState,
    reducers: {

        addCoin(state, action: PayloadAction<string>) {
            if (state.selectedCoins.includes(action.payload)) return;

            if (state.selectedCoins.length < 5) {
                state.selectedCoins.push(action.payload);
            }

            else {
                state.pendingCoin = action.payload;
                state.showDialog = true;
            }
        },

        removeCoin(state, action: PayloadAction<string>) {
            state.selectedCoins = state.selectedCoins.filter(
                coin => coin !== action.payload
            );
        },

        confirmReplaceCoin(state, action: PayloadAction<string>) {

            state.selectedCoins = state.selectedCoins.filter(
                coin => coin !== action.payload
            );

            if (state.pendingCoin) {
                state.selectedCoins.push(state.pendingCoin);
            }

            state.pendingCoin = null;
            state.showDialog = false;
        },

        cancelDialog(state) {
            state.pendingCoin = null;
            state.showDialog = false;
        }
    }
});

export const realTimeReportsActions = realTimeReportsSlice.actions;
export const realTimeReportsReducer = realTimeReportsSlice.reducer;
