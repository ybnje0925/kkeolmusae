import type { GameResult, InvestmentDecision, PriceBook, SettledInvestment } from "@/types/game";
import { finalReturnForDecision, makeParrotQuote } from "./gameEngine";

function pickArchetype(
  decisions: InvestmentDecision[],
  settlements: SettledInvestment[],
  holdCount: number,
  settleCount: number,
  totalReturn: number,
) {
  const roundsPlayed = new Set(decisions.map((item) => item.roundIndex)).size;
  const average = decisions.reduce((sum, item) => sum + item.percent, 0) / Math.max(roundsPlayed, 1);
  const counts = new Map<number, number>();
  decisions.forEach((item) => counts.set(item.percent, (counts.get(item.percent) ?? 0) + 1));
  const lossHeavy = settlements.filter((item) => item.investmentPercent === 100 && item.finalReturnPercent < -20).length;
  if (totalReturn > 1000) return { title: "결과론적 천재", description: "이번 시간선에서는 역사책보다 한발 빨랐습니다." };
  if (lossHeavy >= 2) return { title: "고점 수집가", description: "사람들이 환호할 때 지갑부터 연 흔적이 선명합니다." };
  if (holdCount > settleCount * 1.7 && holdCount >= 3) return { title: "존버 장인", description: "시간을 내 편으로 만드는 데 꽤 진심이었습니다." };
  if ((counts.get(50) ?? 0) >= 4) return { title: "반반무새", description: "확신과 불안을 정확히 반으로 나눴습니다." };
  if (average >= 70) return { title: "몰빵 야수", description: "현금이 쉬고 있는 꼴을 좀처럼 보지 못합니다." };
  if (average <= 30) return { title: "현금 수호대", description: "기회보다 생존을 먼저 챙기는 단단한 지갑입니다." };
  if (settleCount > holdCount) return { title: "익절 중독자", description: "수익은 통장에 찍혀야 비로소 수익이라고 믿습니다." };
  return { title: "껄무새 그 자체", description: "사고도 후회하고, 안 사고도 후회하는 완성형 투자자입니다." };
}

export function analyzeResult(
  startingCash: number,
  finalAsset: number,
  decisions: InvestmentDecision[],
  settlements: SettledInvestment[],
  holdCount: number,
  settleCount: number,
  book: PriceBook,
): GameResult {
  const totalReturnPercent = ((finalAsset / startingCash) - 1) * 100;
  const ranked = [...settlements].sort((a, b) => b.finalReturnPercent - a.finalReturnPercent);
  const missedCandidates = decisions
    .filter((decision) => decision.percent <= 25)
    .map((decision) => {
      const returnPercent = finalReturnForDecision(decision, book);
      return {
        decision,
        returnPercent,
        hypotheticalValue: decision.availableCash * (1 + returnPercent / 100),
      };
    })
    .filter((item) => item.returnPercent > 40)
    .sort((a, b) => b.hypotheticalValue - a.hypotheticalValue);
  const missed = missedCandidates[0];
  const archetype = pickArchetype(decisions, settlements, holdCount, settleCount, totalReturnPercent);
  return {
    finalAsset,
    totalReturnPercent,
    best: ranked[0],
    worst: ranked[ranked.length - 1],
    missed,
    archetype,
    quote: missed ? makeParrotQuote(missed.returnPercent, missed.decision.percent) : makeParrotQuote(totalReturnPercent),
  };
}
