import axios from "axios";
import { CoinModel } from "../Models/CoinModel";
import { appConfig } from "../Utils/AppConfig";
import { store } from "../Redux/Store";
import { PayloadAction } from "@reduxjs/toolkit";
import { AIAnswerModel } from "../Models/AIRecommendationModel";

class CoinService {

    public async getAllCoins(): Promise<CoinModel[]> {
        if (store.getState().coins.length > 0) {
            return store.getState().coins;
        }
        const response = await axios.get<CoinModel[]>(appConfig.coinsUrl);
        const coins = response.data;
       
        const action: PayloadAction<CoinModel[]> = {
            type: "coin-slice/initCoins",
            payload: coins
        };

        store.dispatch(action);
        return coins;

    }
    public async getCoinInfo(coinId: string) {
        const response = await axios.get(appConfig.coinInfoUrl + coinId);

        return response.data;
    }
}

export async function getCoinForAI(
    coinId: string
): Promise<AIAnswerModel> {

    const response = await axios.get(
        `${appConfig.coinInfoUrl}${coinId}?market_data=true`
    );

    const data = response.data.market_data;

    return {
        name: response.data.name,
        current_price_usd: data.current_price.usd,
        market_cap_usd: data.market_cap.usd,
        volume_24h_usd: data.total_volume.usd,
        price_change_percentage_30d_in_currency:
            data.price_change_percentage_30d,
        price_change_percentage_60d_in_currency:
            data.price_change_percentage_60d,
        price_change_percentage_200d_in_currency:
            data.price_change_percentage_200d
    };
}

export const coinService = new CoinService();
