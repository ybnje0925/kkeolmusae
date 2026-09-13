import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

interface CardPool {
  cards: Array<{ ticker: string; entryDate: string }>;
}

interface YahooChart {
  chart: {
    result: Array<{
      timestamp: number[];
      indicators: { adjclose?: Array<{ adjclose: Array<number | null> }> };
    }> | null;
    error: { description?: string } | null;
  };
}

async function main() {
  const projectRoot = process.cwd();
  const pool = JSON.parse(await readFile(join(projectRoot, "src/data/kkeolmusae_card_pool_v1.json"), "utf8")) as CardPool;
  const tickers = [...new Set(pool.cards.map((card) => card.ticker))];
  const evaluationDates = [...new Set(pool.cards.map((card) => card.entryDate))].sort();
  const outputDirectory = join(projectRoot, "src/data/prices");
  const allPrices: Record<string, Array<{ date: string; adjustedClose: number }>> = {};

  await mkdir(outputDirectory, { recursive: true });

  for (const ticker of tickers) {
    const period1 = 946684800; // 2000-01-01 UTC
    const period2 = Math.floor(Date.now() / 1000);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?period1=${period1}&period2=${period2}&interval=1d&events=div%2Csplits`;
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 kkeolmusae-price-ingestion" } });
    if (!response.ok) {
      console.warn(`[skip] ${ticker}: HTTP ${response.status}`);
      continue;
    }
    const payload = await response.json() as YahooChart;
    const result = payload.chart.result?.[0];
    const adjusted = result?.indicators.adjclose?.[0]?.adjclose;
    if (!result || !adjusted) {
      console.warn(`[skip] ${ticker}: ${payload.chart.error?.description ?? "adjusted close 없음"}`);
      continue;
    }
    const points = result.timestamp.flatMap((timestamp, index) => {
      const value = adjusted[index];
      return typeof value === "number" && Number.isFinite(value)
        ? [{ date: new Date(timestamp * 1000).toISOString().slice(0, 10), adjustedClose: Number(value.toFixed(6)) }]
        : [];
    });
    // The per-ticker file keeps the complete daily source. The browser index only
    // carries the nearest trading days around every possible game date + latest.
    // This keeps the static client bundle small without changing game results.
    const sampled = new Map<string, { date: string; adjustedClose: number }>();
    for (const date of evaluationDates) {
      const next = points.find((point) => point.date >= date);
      let previous: { date: string; adjustedClose: number } | undefined;
      for (const point of points) {
        if (point.date > date) break;
        previous = point;
      }
      if (previous) sampled.set(previous.date, previous);
      if (next) sampled.set(next.date, next);
    }
    const latest = points[points.length - 1];
    if (latest) sampled.set(latest.date, latest);
    allPrices[ticker] = [...sampled.values()].sort((a, b) => a.date.localeCompare(b.date));
    const safeName = ticker.replace(/[^a-zA-Z0-9.-]/g, "_");
    await writeFile(join(outputDirectory, `${safeName}.json`), JSON.stringify(points), "utf8");
    console.log(`[ok] ${ticker}: ${points.length} trading days`);
  }

  await writeFile(join(outputDirectory, "index.json"), JSON.stringify(allPrices), "utf8");
  console.log(`Saved ${Object.keys(allPrices).length}/${tickers.length} ticker series.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
