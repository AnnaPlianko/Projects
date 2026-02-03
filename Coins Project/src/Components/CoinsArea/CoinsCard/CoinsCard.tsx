import { useState } from "react";
import { CoinModel } from "../../../Models/CoinModel";
import { CoinInfo } from "../CoinInfo/CoinInfo";
import "./CoinsCard.css";
import { useDispatch, useSelector } from "react-redux";
import { realTimeReportsActions } from "../../../Redux/RealTimeReportsSlice";
import { AppState } from "../../../Redux/AppState";

type CoinsCardProps = { coin: CoinModel };

export function CoinsCard({ coin }: CoinsCardProps) {
    const [showInfo, setShowInfo] = useState(false);
    const dispatch = useDispatch();
    const selectedCoins = useSelector((state: AppState) => state.realTimeReports.selectedCoins);
    const isOn = coin.symbol ? selectedCoins.includes(coin.symbol.toLowerCase()) : false;

    return (

        <div className="CoinsCard">
            {!showInfo && (
                <>
                    <div>
                        <span>{coin.name}</span>
                    </div>

                    <div>
                        <span>{coin.symbol}</span>
                    </div>

                    {coin.image && (
                        <div>
                            <img src={coin.image} alt={coin.name} />
                        </div>
                    )}

                    <div className="toggle">
                        <div
                            className={`toggle-track ${isOn ? "on" : ""}`}
                            onClick={() => {
                                if (!coin.symbol) return;

                                const symbol = coin.symbol.toLowerCase();

                                if (isOn) {
                                    dispatch(realTimeReportsActions.removeCoin(symbol));
                                }

                                else {
                                    dispatch(realTimeReportsActions.addCoin(symbol));
                                }
                            }}
                        >
                            <div className="toggle-thumb"></div>
                        </div>
                    </div>

                    <button onClick={() => setShowInfo(true)}> More Info </button>
                </>
            )}

            {showInfo && (
                <>
                    <CoinInfo coinId={coin.id} />
                    <button onClick={() => setShowInfo(false)}> Back </button>
                </>
            )}
        </div>

    );

}
