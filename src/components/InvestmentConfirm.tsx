import { ArrowRight, Check } from "lucide-react";
import type { InvestmentDecision } from "@/types/game";
import { anonymousLabel, formatWon } from "@/lib/formatters";

interface Props {
  decision: InvestmentDecision;
  remainingCash: number;
  isLast: boolean;
  onContinue: () => void;
}

export function InvestmentConfirm({ decision, remainingCash, isLast, onContinue }: Props) {
  return (
    <main className="screen confirm-screen">
      <div className="confirm-mark"><Check size={28} /></div>
      <p className="eyebrow">선택 완료</p>
      <h2>{decision.percent === 0 ? "이번 기회는 지나갑니다." : `${anonymousLabel(decision.card.anonymousNumber, decision.card.assetClass)}에 투자했습니다.`}</h2>
      <div className="confirm-receipt">
        <div><span>선택 비율</span><strong>{decision.percent}%</strong></div>
        <div><span>투자금</span><strong>{formatWon(decision.investedAmount)}</strong></div>
        <div><span>남은 현금</span><strong>{formatWon(remainingCash)}</strong></div>
      </div>
      {decision.percent === 0 ? <div className="parrot-quote"><span>🦜</span><p>미래의 내가 뭐라고 할까…</p></div> : null}
      <button className="primary-button" onClick={onContinue}>
        {isLast ? "시간여행 마치기" : "다음 시대로"} <ArrowRight size={19} />
      </button>
    </main>
  );
}
