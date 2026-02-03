export class CoinModel {
  public id!: string;
  public name!: string;
  public symbol!: string;
  public image!: string;
}

export type CoinRatesModel = {
  usd: number;
  eur: number;
  ils: number;
};
