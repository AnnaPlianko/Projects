import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoinModel } from "../Models/CoinModel";


function initCoins(_currentState: CoinModel[], action: PayloadAction<CoinModel[]>): CoinModel[] {
    const coinsToInit = action.payload;
    const newState = coinsToInit;
    return newState;
}

export const coinsSlice = createSlice({
    name: "coin-slice",
    initialState: [] as CoinModel[],
    reducers: { initCoins }
});
