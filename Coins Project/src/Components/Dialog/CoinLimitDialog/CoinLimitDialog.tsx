import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import { realTimeReportsActions } from "../../../Redux/RealTimeReportsSlice";
import "./CoinLimitDialog.css";


export function CoinLimitDialog() {

    const dispatch = useDispatch();

    const { selectedCoins, showDialog } = useSelector(
        (state: AppState) => state.realTimeReports
    );

    const [coinToRemove, setCoinToRemove] = useState<string>("");

    if (!showDialog) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-box">
                <h3>You can select up to 5 coins</h3>
                <p>Please remove one coin to continue:</p>

                {selectedCoins.map(coin => (
                    <label key={coin}>
                        <input
                            type="radio"
                            name="removeCoin"
                            value={coin}
                            onChange={() => setCoinToRemove(coin)}
                        />
                        {coin.toUpperCase()}
                    </label>
                ))}

                <div className="dialog-actions">
                    <button
                        disabled={!coinToRemove}
                        onClick={() =>
                            dispatch(
                                realTimeReportsActions.confirmReplaceCoin(
                                    coinToRemove
                                )
                            )
                        }
                    >
                        Confirm
                    </button>

                    <button
                        onClick={() =>
                            dispatch(
                                realTimeReportsActions.cancelDialog()
                            )
                        }
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
