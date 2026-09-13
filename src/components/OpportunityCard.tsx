import { ChevronDown, PieChart } from "lucide-react";
import { useState } from "react";
import type { AnonymousCard } from "@/types/game";
import { anonymousLabel, formatWon, getYear } from "@/lib/formatters";

const PERCENT_OPTIONS = [0, 25, 50, 100];

interface Props {
  cards: AnonymousCard[];
  cash: number;
  onInvest: (allocations: number[]) => void;
}

export function OpportunityCard({ cards, cash, onInvest }: Props) {
  const [allocations, setAllocations] = useState(() => cards.map(() => 0));
  const totalPercent = allocations.reduce((sum, percent) => sum + percent, 0);
  const remainingPercent = 100 - totalPercent;

  const updateAllocation = (cardIndex: number, percent: number) => {
    setAllocations((current) => current.map((value, index) => index === cardIndex ? percent : value));
  };

  return (
    <main className="screen opportunity-screen">
      <div className="opportunity-heading basket-heading">
        <div>
          <p className="eyebrow">새로운 투자 기회 · 3개</p>
          <h2>이번 시대의 선택지</h2>
        </div>
        <PieChart size={25} aria-hidden="true" />
      </div>

      <p className="basket-guide">카드를 펼쳐 당시 정보만 확인하고, 현재 현금을 세 자산에 나눠 담아보세요.</p>

      <div className="opportunity-list">
        {cards.map((card, cardIndex) => {
          const selectedPercent = allocations[cardIndex];
          return (
            <details className="mini-opportunity" key={card.id} open={cardIndex === 0 ? true : undefined}>
              <summary>
                <div className="mini-title">
                  <span>{getYear(card.entryDate)}</span>
                  <strong>{anonymousLabel(card.anonymousNumber, card.assetClass)}</strong>
                </div>
                <div className="mini-allocation">
                  <strong>{selectedPercent}%</strong>
                  <ChevronDown size={18} aria-hidden="true" />
                </div>
              </summary>
              <div className="mini-card-body">
                <div className="card-index"><span>당시 공개 정보</span><span>{card.anonymousFacts.length}개</span></div>
                <ul>
                  {card.anonymousFacts.map((fact) => <li key={fact}>{fact}</li>)}
                </ul>
                <fieldset className="allocation-fieldset">
                  <legend>현금 배분</legend>
                  <div className="allocation-options">
                    {PERCENT_OPTIONS.map((percent) => {
                      const exceedsLimit = totalPercent - selectedPercent + percent > 100;
                      return (
                        <button
                          type="button"
                          key={percent}
                          className={selectedPercent === percent ? "selected" : ""}
                          disabled={exceedsLimit}
                          aria-pressed={selectedPercent === percent}
                          onClick={() => updateAllocation(cardIndex, percent)}
                        >
                          {percent}%
                        </button>
                      );
                    })}
                  </div>
                  <p>{selectedPercent === 0 ? "투자하지 않음" : `${formatWon(cash * selectedPercent / 100)} 투자`}</p>
                </fieldset>
              </div>
            </details>
          );
        })}
      </div>

      <section className="allocation-summary">
        <div className="cash-available"><span>현재 투자 가능 현금</span><strong>{formatWon(cash)}</strong></div>
        <div className="allocation-meter" aria-label={`현금 ${totalPercent}% 배분, ${remainingPercent}% 보유`}>
          <span style={{ width: `${totalPercent}%` }} />
        </div>
        <div className="allocation-totals">
          <span>투자 {totalPercent}% · {formatWon(cash * totalPercent / 100)}</span>
          <span>현금 유지 {remainingPercent}%</span>
        </div>
        <button className="primary-button" onClick={() => onInvest(allocations)}>
          이대로 분산 투자하기
        </button>
      </section>
    </main>
  );
}
