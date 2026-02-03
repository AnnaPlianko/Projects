import { CoinList } from "../../CoinsArea/CoinList/CoinList";
import { CoinLimitDialog } from "../../Dialog/CoinLimitDialog/CoinLimitDialog";
import "./Home.css";

export function Home() {
    return (
        <div className="Home">
            <CoinList />
            <CoinLimitDialog />
        </div>
    );
}
