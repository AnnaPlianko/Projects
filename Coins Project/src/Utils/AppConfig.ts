class AppConfig {
    public readonly coinsUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
    public readonly coinInfoUrl = "https://api.coingecko.com/api/v3/coins/";
    public readonly realTimePricesUrl = "https://min-api.cryptocompare.com/data/pricemulti?tsyms=usd&fsyms=";
    public readonly openAiUrl = "https://api.openai.com/v1/chat/completions";
}

export const appConfig = new AppConfig();
