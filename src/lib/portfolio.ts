import type { Position, PriceBook } from "@/types/game";
import { getEvaluationPrice, getLatestPrice } from "./prices";

export function valuePosition(position: Position, date: string, book: PriceBook): Position {
  const price = getEvaluationPrice(book, position.ticker, date).adjustedClose;
  const currentValue = position.units * price;
  return {
    ...position,
    currentValue,
    returnPercent: ((currentValue / position.investedAmount) - 1) * 100,
  };
}

export function valuePositionAtLatest(position: Position, book: PriceBook): Position {
  const price = getLatestPrice(book, position.ticker).adjustedClose;
  const currentValue = position.units * price;
  return {
    ...position,
    currentValue,
    returnPercent: ((currentValue / position.investedAmount) - 1) * 100,
  };
}

export function totalAssets(cash: number, positions: Position[]): number {
  return cash + positions.reduce((sum, position) => sum + position.currentValue, 0);
}
