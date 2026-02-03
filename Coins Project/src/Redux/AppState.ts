import { CoinModel } from "../Models/CoinModel";
import { RealTimeReportsState } from "./RealTimeReportsSlice";

export type AppState = {
    coins: CoinModel[];
    searchText: string;
    realTimeReports: RealTimeReportsState;
};
