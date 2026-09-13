export type AssetClass = "stock" | "etf" | "crypto" | string;

export interface GameCard {
  id: string;
  entryDate: string;
  revealName: string;
  ticker: string;
  market: string;
  assetClass: AssetClass;
  difficulty: string;
  role: string;
  anonymousFacts: string[];
}

export interface CardPool {
  version: string;
  game: { startingCashKRW: number; cardsPerGame: number };
  cards: GameCard[];
}

export interface PricePoint {
  date: string;
  adjustedClose: number;
}

export type PriceBook = Record<string, PricePoint[]>;

export interface AnonymousCard extends GameCard {
  anonymousNumber: number;
}

export interface Position {
  id: string;
  cardId: string;
  anonymousNumber: number;
  ticker: string;
  revealName: string;
  entryDate: string;
  entryPrice: number;
  investedAmount: number;
  units: number;
  investmentPercent: number;
  currentValue: number;
  returnPercent: number;
}

export interface InvestmentDecision {
  card: AnonymousCard;
  percent: number;
  availableCash: number;
  investedAmount: number;
  entryPrice: number;
}

export interface SettledInvestment extends Position {
  settledDate: string;
  settledValue: number;
  finalReturnPercent: number;
  autoSettled: boolean;
}

export type GamePhase =
  | "INTRO"
  | "ROUND_TRANSITION"
  | "REVIEW_HOLDINGS"
  | "NEW_INVESTMENT"
  | "INVESTMENT_CONFIRM"
  | "FINAL_SETTLEMENT"
  | "RESULT";

export interface GameResult {
  finalAsset: number;
  totalReturnPercent: number;
  best?: SettledInvestment;
  worst?: SettledInvestment;
  missed?: {
    decision: InvestmentDecision;
    returnPercent: number;
    hypotheticalValue: number;
  };
  archetype: { title: string; description: string };
  quote: string;
}
