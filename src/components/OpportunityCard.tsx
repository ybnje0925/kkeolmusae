import type { AnonymousCard } from "@/types/game";
import { anonymousLabel, formatWon, getYear } from "@/lib/formatters";

interface Props {
  card: AnonymousCard;
  cash: number;
  onInvest: (percent: number) => void;
}

export function OpportunityCard({ card, cash, onInvest }: Props) {
  return (
    <main className="screen opportunity-screen">
      <div className="opportunity-heading">
        <p className="eyebrow">새로운 투자 기회</p>
        <h2><span>{getYear(card.entryDate)}</span>{anonymousLabel(card.anonymousNumber, card.assetClass)}</h2>
      </div>

      <article className="fact-card">
        <div className="card-index"><span>당시 공개 정보</span><span>{card.anonymousFacts.length}개</span></div>
        <ul>
          {card.anonymousFacts.map((fact) => <li key={fact}>{fact}</li>)}
        </ul>
      </article>

      <section className="investment-panel">
        <div className="cash-available"><span>현재 투자 가능 현금</span><strong>{formatWon(cash)}</strong></div>
        <h3>얼마나 투자하시겠습니까?</h3>
        <p>선택 비율은 현재 현금에만 적용됩니다.</p>
        <div className="percent-grid">
          {[0, 25, 50, 100].map((percent) => (
            <button key={percent} onClick={() => onInvest(percent)} aria-label={`현재 현금의 ${percent}% 투자`}>
              <strong>{percent}%</strong>
              <span>{formatWon(cash * percent / 100)}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
