import { useEffect, useState } from "react";
import "./CoinInfo.css";
import { coinService } from "../../../Services/CoinService";
import { notify } from "../../../Utils/Notify";

type Prices = {
  usd: number;
  eur: number;
  ils: number;
};

export function CoinInfo({ coinId }: { coinId: string }) {

  const [prices, setPrices] = useState<Prices | null>(null);

  useEffect(() => {
    coinService.getCoinInfo(coinId)
      .then(data => {
        setPrices(data.market_data.current_price);
      })
      .catch(err => notify.error(err));
  }, [coinId]);

  if (!prices) return <p>Loading...</p>;

  return (
    <div className="CoinInfo">
      <p> USD: {prices.usd.toFixed(2)} $</p>
      <p> EUR: {prices.eur.toFixed(2)} €</p>
      <p> ILS: {prices.ils.toFixed(2)} ₪</p>
    </div>
  );
}
