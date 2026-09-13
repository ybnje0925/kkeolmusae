import { ArrowRight, Check } from "lucide-react";
import type { InvestmentDecision } from "@/types/game";
import { anonymousLabel, formatWon } from "@/lib/formatters";

interface Props {
  decisions: InvestmentDecision[];
  remainingCash: number;
  isLast: boolean;
  onContinue: () => void;
}

export function InvestmentConfirm({ decisions, remainingCash, isLast, onContinue }: Props) {
  const invested = decisions.filter((decision) => decision.percent > 0);
  const totalPercent = decisions.reduce((sum, decision) => sum + decision.percent, 0);
  const totalInvestment = decisions.reduce((sum, decision) => sum + decision.investedAmount, 0);

  return (
    <main className="screen confirm-screen">
      <div className="confirm-mark"><Check size={28} /></div>
      <p className="eyebrow">배분 완료</p>
      <h2>{invested.length === 0 ? "이번 세 가지 기회는 지나갑니다." : `${invested.length}개 자산에 나눠 투자했습니다.`}</h2>
      <div className="allocation-receipt-list">
        {decisions.map((decision) => (
          <div key={decision.card.id}>
            <span>{anonymousLabel(decision.card.anonymousNumber, decision.card.assetClass)}</span>
            <strong>{decision.percent}% <small>{formatWon(decision.investedAmount)}</small></strong>
          </div>
        ))}
      </div>
      <div className="confirm-receipt basket-receipt">
        <div><span>총 투자 비율</span><strong>{totalPercent}%</strong></div>
        <div><span>총 투자금</span><strong>{formatWon(totalInvestment)}</strong></div>
        <div><span>남은 현금</span><strong>{formatWon(remainingCash)}</strong></div>
      </div>
      {invested.length === 0 ? <div className="parrot-quote"><span>🦜</span><p>셋 다 안 산 미래는 과연…</p></div> : null}
      <button className="primary-button" onClick={onContinue}>
        {isLast ? "시간여행 마치기" : "다음 시대로"} <ArrowRight size={19} />
      </button>
    </main>
  );
}
