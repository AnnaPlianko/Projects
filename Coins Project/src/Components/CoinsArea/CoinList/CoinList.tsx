import { useEffect } from "react";
import { CoinsCard } from "../CoinsCard/CoinsCard";
import "./CoinList.css";
import { coinService } from "../../../Services/CoinService";
import { notify } from "../../../Utils/Notify";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";

export function CoinList() {
    const coins = useSelector((state: AppState) => state.coins) ?? [];
    const searchText = useSelector((state: AppState) => state.searchText);

    useEffect(() => {
        coinService.getAllCoins()
            .catch(err => notify.error(err.message));
    }, []);

    const filteredCoins = coins.filter(c =>
        c.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="CoinList">
            <ul>
                {filteredCoins.map(c => <CoinsCard key={c.id} coin={c} />)}
            </ul>
        </div>
    );
}
