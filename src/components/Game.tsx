"use client";

import { useMemo, useState } from "react";
import cardPoolData from "@/data/kkeolmusae_card_pool_v1.json";
import priceData from "@/data/prices/index.json";
import type {
  AnonymousCard,
  CardPool,
  GamePhase,
  InvestmentDecision,
  Position,
  PriceBook,
  SettledInvestment,
} from "@/types/game";
import { analyzeResult } from "@/lib/resultAnalysis";
import { createPosition, latestDateForTicker, selectGameCards, settlePosition } from "@/lib/gameEngine";
import { valuePosition, valuePositionAtLatest } from "@/lib/portfolio";
import { getYear } from "@/lib/formatters";
import { IntroScreen } from "./IntroScreen";
import { GameHeader } from "./GameHeader";
import { YearTransition } from "./YearTransition";
import { OpportunityCard } from "./OpportunityCard";
import { HoldingReviewCard } from "./HoldingReviewCard";
import { SettlementReveal } from "./SettlementReveal";
import { InvestmentConfirm } from "./InvestmentConfirm";
import { FinalSettlement } from "./FinalSettlement";
import { ResultScreen } from "./ResultScreen";

const pool = cardPoolData as CardPool;
const priceBook = priceData as PriceBook;
const STARTING_CASH = pool.game.startingCashKRW;
const TOTAL_ROUNDS = pool.game.cardsPerGame;

export function Game() {
  const [phase, setPhase] = useState<GamePhase>("INTRO");
  const [cards, setCards] = useState<AnonymousCard[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [cash, setCash] = useState(STARTING_CASH);
  const [positions, setPositions] = useState<Position[]>([]);
  const [decisions, setDecisions] = useState<InvestmentDecision[]>([]);
  const [settlements, setSettlements] = useState<SettledInvestment[]>([]);
  const [lastDecision, setLastDecision] = useState<InvestmentDecision>();
  const [reviewIndex, setReviewIndex] = useState(0);
  const [activeReveal, setActiveReveal] = useState<SettledInvestment>();
  const [finalReveals, setFinalReveals] = useState<SettledInvestment[]>([]);
  const [holdCount, setHoldCount] = useState(0);
  const [settleCount, setSettleCount] = useState(0);
  const [error, setError] = useState<string>();

  const currentCard = cards[roundIndex];
  const currentYear = currentCard ? getYear(currentCard.entryDate) : "현재";
  const result = useMemo(() => {
    if (phase !== "RESULT") return undefined;
    return analyzeResult(STARTING_CASH, cash, decisions, settlements, holdCount, settleCount, priceBook);
  }, [phase, cash, decisions, settlements, holdCount, settleCount]);

  const startGame = () => {
    try {
      const nextCards = selectGameCards(pool.cards, priceBook, TOTAL_ROUNDS);
      setCards(nextCards);
      setRoundIndex(0);
      setCash(STARTING_CASH);
      setPositions([]);
      setDecisions([]);
      setSettlements([]);
      setFinalReveals([]);
      setLastDecision(undefined);
      setHoldCount(0);
      setSettleCount(0);
      setError(undefined);
      setPhase("ROUND_TRANSITION");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "게임을 시작하지 못했습니다.");
    }
  };

  const enterRound = () => {
    if (!currentCard) return;
    const valued = positions.map((position) => valuePosition(position, currentCard.entryDate, priceBook));
    setPositions(valued);
    setReviewIndex(0);
    setPhase(valued.length > 0 ? "REVIEW_HOLDINGS" : "NEW_INVESTMENT");
  };

  const invest = (percent: number) => {
    if (!currentCard) return;
    const next = createPosition(currentCard, percent, cash, priceBook);
    setCash(next.remainingCash);
    if (next.position) setPositions((current) => [...current, next.position!]);
    setDecisions((current) => [...current, next.decision]);
    setLastDecision(next.decision);
    setPhase("INVESTMENT_CONFIRM");
  };

  const finishTimeTravel = () => {
    const valued = positions.map((position) => valuePositionAtLatest(position, priceBook));
    const autoSettled = valued.map((position) =>
      settlePosition(position, latestDateForTicker(priceBook, position.ticker), true),
    );
    const proceeds = autoSettled.reduce((sum, item) => sum + item.settledValue, 0);
    setCash((current) => current + proceeds);
    setSettlements((current) => [...current, ...autoSettled]);
    setPositions([]);
    setFinalReveals(autoSettled);
    setPhase("FINAL_SETTLEMENT");
  };

  const leaveConfirmation = () => {
    if (roundIndex === cards.length - 1) {
      finishTimeTravel();
      return;
    }
    setRoundIndex((current) => current + 1);
    setPhase("ROUND_TRANSITION");
  };

  const holdPosition = () => {
    setHoldCount((current) => current + 1);
    const nextIndex = reviewIndex + 1;
    if (nextIndex >= positions.length) setPhase("NEW_INVESTMENT");
    else setReviewIndex(nextIndex);
  };

  const settleCurrentPosition = () => {
    const position = positions[reviewIndex];
    if (!position || !currentCard) return;
    const settlement = settlePosition(position, currentCard.entryDate);
    const remaining = positions.filter((item) => item.id !== position.id);
    setPositions(remaining);
    setCash((current) => current + settlement.settledValue);
    setSettlements((current) => [...current, settlement]);
    setSettleCount((current) => current + 1);
    setActiveReveal(settlement);
  };

  const closeReveal = () => {
    setActiveReveal(undefined);
    if (reviewIndex >= positions.length) setPhase("NEW_INVESTMENT");
  };

  if (phase === "INTRO") {
    return (
      <div className="game-shell">
        <IntroScreen onStart={startGame} />
        {error ? <p className="startup-error" role="alert">{error} 가격 데이터를 먼저 준비해주세요.</p> : null}
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className="game-shell">
      {phase !== "RESULT" ? (
        <GameHeader
          phase={phase}
          year={phase === "FINAL_SETTLEMENT" ? "현재" : currentYear}
          cash={cash}
          positions={positions}
          round={phase === "FINAL_SETTLEMENT" ? TOTAL_ROUNDS : roundIndex + 1}
          totalRounds={TOTAL_ROUNDS}
        />
      ) : null}

      {phase === "ROUND_TRANSITION" ? (
        <YearTransition
          fromDate={roundIndex > 0 ? cards[roundIndex - 1].entryDate : undefined}
          toDate={currentCard.entryDate}
          onContinue={enterRound}
        />
      ) : null}
      {phase === "REVIEW_HOLDINGS" && positions[reviewIndex] ? (
        <HoldingReviewCard position={positions[reviewIndex]} index={reviewIndex} total={positions.length} onHold={holdPosition} onSettle={settleCurrentPosition} />
      ) : null}
      {phase === "NEW_INVESTMENT" ? <OpportunityCard card={currentCard} cash={cash} onInvest={invest} /> : null}
      {phase === "INVESTMENT_CONFIRM" && lastDecision ? (
        <InvestmentConfirm decision={lastDecision} remainingCash={cash} isLast={roundIndex === cards.length - 1} onContinue={leaveConfirmation} />
      ) : null}
      {phase === "FINAL_SETTLEMENT" ? <FinalSettlement settlements={finalReveals} onContinue={() => setPhase("RESULT")} /> : null}
      {phase === "RESULT" && result ? <ResultScreen result={result} startingCash={STARTING_CASH} onRestart={startGame} /> : null}
      {activeReveal ? <SettlementReveal settlement={activeReveal} newCash={cash} onContinue={closeReveal} /> : null}
    </div>
  );
}
