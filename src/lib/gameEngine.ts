import type {
  AnonymousCard,
  GameCard,
  InvestmentDecision,
  Position,
  PriceBook,
  SettledInvestment,
} from "@/types/game";
import { getEntryPrice, getLatestPrice, hasUsablePrice } from "./prices";

const RISK_WORDS = ["함정", "폭락", "고변동", "고위험", "고점", "광풍", "급락", "이벤트"];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function isRiskCard(card: GameCard): boolean {
  return RISK_WORDS.some((word) => card.role.includes(word));
}

function canAdd(card: GameCard, selected: GameCard[]): boolean {
  const names = new Set(selected.map((item) => item.revealName));
  const years = new Set(selected.map((item) => item.entryDate.slice(0, 4)));
  return !names.has(card.revealName) && !years.has(card.entryDate.slice(0, 4));
}

export function selectGameCards(cards: GameCard[], book: PriceBook, count = 8): AnonymousCard[] {
  const available = cards.filter((card) => hasUsablePrice(book, card.ticker, card.entryDate));
  if (available.length < count) throw new Error("플레이 가능한 가격 데이터가 부족합니다.");

  const selected: GameCard[] = [];
  const addFrom = (candidates: GameCard[]) => {
    const candidate = shuffle(candidates).find((card) => canAdd(card, selected));
    if (candidate) selected.push(candidate);
  };

  addFrom(available.filter((card) => card.assetClass !== "stock"));
  addFrom(available.filter(isRiskCard));
  addFrom(available.filter((card) => isRiskCard(card) && !selected.includes(card)));

  for (const card of shuffle(available)) {
    if (selected.length >= count) break;
    if (canAdd(card, selected)) selected.push(card);
  }

  if (selected.length < count) {
    for (const card of shuffle(available)) {
      if (selected.length >= count) break;
      if (!selected.includes(card) && !selected.some((item) => item.revealName === card.revealName)) {
        selected.push(card);
      }
    }
  }

  const numbers = shuffle(Array.from({ length: 90 }, (_, index) => index + 1));
  return selected
    .slice(0, count)
    .sort((a, b) => a.entryDate.localeCompare(b.entryDate))
    .map((card, index) => ({ ...card, anonymousNumber: numbers[index] }));
}

export function createPosition(
  card: AnonymousCard,
  percent: number,
  cash: number,
  book: PriceBook,
): { position?: Position; decision: InvestmentDecision; remainingCash: number } {
  const entry = getEntryPrice(book, card.ticker, card.entryDate);
  const investedAmount = cash * (percent / 100);
  const decision: InvestmentDecision = {
    card,
    percent,
    availableCash: cash,
    investedAmount,
    entryPrice: entry.adjustedClose,
  };
  if (investedAmount === 0) return { decision, remainingCash: cash };
  const position: Position = {
    id: `${card.id}-${crypto.randomUUID()}`,
    cardId: card.id,
    anonymousNumber: card.anonymousNumber,
    ticker: card.ticker,
    revealName: card.revealName,
    entryDate: entry.date,
    entryPrice: entry.adjustedClose,
    investedAmount,
    units: investedAmount / entry.adjustedClose,
    investmentPercent: percent,
    currentValue: investedAmount,
    returnPercent: 0,
  };
  return { position, decision, remainingCash: cash - investedAmount };
}

export function makeParrotQuote(returnPercent: number, percent = 100): string {
  if (percent === 0 && returnPercent > 100) return "살껄…";
  if (returnPercent > 700) return "그때 더 살껄!!!";
  if (returnPercent > 40) return "조금만 더 들고 있을껄?";
  if (returnPercent < -60) return "안 살껄…";
  if (returnPercent < 0) return "진작 팔껄…";
  return "나쁘지 않았껄.";
}

export function finalReturnForDecision(decision: InvestmentDecision, book: PriceBook): number {
  const latest = getLatestPrice(book, decision.card.ticker).adjustedClose;
  return ((latest / decision.entryPrice) - 1) * 100;
}

export function latestDateForTicker(book: PriceBook, ticker: string): string {
  return getLatestPrice(book, ticker).date;
}

export function settlePosition(position: Position, date: string, autoSettled = false): SettledInvestment {
  return {
    ...position,
    settledDate: date,
    settledValue: position.currentValue,
    finalReturnPercent: position.returnPercent,
    autoSettled,
  };
}
