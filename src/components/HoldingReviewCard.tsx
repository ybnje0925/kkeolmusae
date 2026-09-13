import type { Position } from "@/types/game";
import { anonymousLabel, formatPercent, formatWon } from "@/lib/formatters";

interface Props {
  position: Position;
  index: number;
  total: number;
  onHold: () => void;
  onSettle: () => void;
}

export function HoldingReviewCard({ position, index, total, onHold, onSettle }: Props) {
  const positive = position.returnPercent >= 0;
  const extreme = Math.abs(position.returnPercent) >= 100;
  return (
    <main className="screen review-screen">
      <div className="review-intro">
        <p className="eyebrow">보유 자산 확인 · {index + 1}/{total}</p>
        <h2>{anonymousLabel(position.anonymousNumber)}</h2>
        <p>새로운 기회로 가기 전에 이 투자를 결정하세요.</p>
      </div>
      <article className={`valuation-card ${positive ? "positive" : "negative"} ${extreme ? "extreme" : ""}`}>
        <div><span>처음 투자금</span><strong>{formatWon(position.investedAmount)}</strong></div>
        <div className="valuation-main"><span>현재 평가액</span><strong>{formatWon(position.currentValue)}</strong></div>
        <div><span>현재 수익률</span><strong className={positive ? "gain" : "loss"}>{positive ? "수익 " : "손실 "}{formatPercent(position.returnPercent)}</strong></div>
      </article>
      <p className="identity-warning">계속 보유하면 정체는 공개되지 않습니다.</p>
      <div className="decision-actions">
        <button className="secondary-button" onClick={onHold}>계속 보유한다</button>
        <button className="primary-button" onClick={onSettle}>정산한다</button>
      </div>
    </main>
  );
}
