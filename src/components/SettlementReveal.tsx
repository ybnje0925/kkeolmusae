import { Check } from "lucide-react";
import type { SettledInvestment } from "@/types/game";
import { anonymousLabel, formatPercent, formatWon } from "@/lib/formatters";
import { makeParrotQuote } from "@/lib/gameEngine";

interface Props {
  settlement: SettledInvestment;
  newCash: number;
  onContinue: () => void;
}

export function SettlementReveal({ settlement, newCash, onContinue }: Props) {
  return (
    <div className="reveal-backdrop" role="dialog" aria-modal="true" aria-labelledby="reveal-title">
      <section className="reveal-sheet">
        <div className="success-icon"><Check size={20} /></div>
        <p className="eyebrow">정산 완료</p>
        <p>{anonymousLabel(settlement.anonymousNumber)}의 정체는…</p>
        <h2 id="reveal-title" className="identity-reveal">{settlement.revealName}</h2>
        <div className="settlement-numbers">
          <div><span>투자금</span><strong>{formatWon(settlement.investedAmount)}</strong></div>
          <div><span>정산금</span><strong>{formatWon(settlement.settledValue)}</strong></div>
          <div><span>수익률</span><strong className={settlement.finalReturnPercent >= 0 ? "gain" : "loss"}>{formatPercent(settlement.finalReturnPercent)}</strong></div>
        </div>
        <div className="parrot-quote"><span aria-hidden="true">🦜</span><p>“{makeParrotQuote(settlement.finalReturnPercent, settlement.investmentPercent)}”</p></div>
        <p className="new-cash">새로운 현금 <strong>{formatWon(newCash)}</strong></p>
        <button className="primary-button" onClick={onContinue}>계속하기</button>
      </section>
    </div>
  );
}
