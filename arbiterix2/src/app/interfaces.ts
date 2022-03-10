export interface Quote {
  AverageDailyVolume: number;
  Change: number;
  DaysLow: number;
  DaysHigh: number;
  YearLow: number;
  YearHigh: number;
  MarketCapitalization: number;
  LastTradePriceOnly: number;
  DaysRange: string;
  Name: string;
  Symbol: string;
  Volume: number;
  StockExchange: string;
}

export interface QuoteSearch {
  symbol: string;
  name: string;
  exch: string;
  type: string;
}

export interface Stock {
  Name: string;
  Symbol: string;
  Quantity: number;
  Price: number;
  Change: number;
}

interface Price {
  price: number;
  change: number;
}

export interface StockPrices {
  [index: string]: Price;
}
