import type { PriceBook, PricePoint } from "@/types/game";

function seriesFor(book: PriceBook, ticker: string): PricePoint[] {
  const series = book[ticker];
  if (!series?.length) throw new Error(`가격 데이터 없음: ${ticker}`);
  return series;
}

export function hasUsablePrice(book: PriceBook, ticker: string, entryDate: string): boolean {
  const series = book[ticker];
  return Boolean(series?.some((point) => point.date >= entryDate));
}

export function getEntryPrice(book: PriceBook, ticker: string, date: string): PricePoint {
  const series = seriesFor(book, ticker);
  return series.find((point) => point.date >= date) ?? series[series.length - 1];
}

export function getEvaluationPrice(book: PriceBook, ticker: string, date: string): PricePoint {
  const series = seriesFor(book, ticker);
  let match = series[0];
  for (const point of series) {
    if (point.date > date) break;
    match = point;
  }
  return match;
}

export function getLatestPrice(book: PriceBook, ticker: string): PricePoint {
  const series = seriesFor(book, ticker);
  return series[series.length - 1];
}
