import type { SettledInvestment } from "@/types/game";
import { anonymousLabel, formatPercent, formatWon } from "@/lib/formatters";

export function FinalSettlement({ settlements, onContinue }: { settlements: SettledInvestment[]; onContinue: () => void }) {
  return (
    <main className="screen final-settlement-screen">
      <div className="final-heading">
        <p className="eyebrow">최종 정산</p>
        <h2>시간여행이 끝났습니다.</h2>
        <p>끝까지 보유한 자산의 정체를 공개합니다.</p>
      </div>
      {settlements.length > 0 ? (
        <div className="final-reveal-list">
          {settlements.map((item, index) => (
            <article key={item.id} style={{ animationDelay: `${index * 120}ms` }}>
              <div><span>{anonymousLabel(item.anonymousNumber)}</span><strong>{item.revealName}</strong></div>
              <div><span>{formatWon(item.settledValue)}</span><strong className={item.finalReturnPercent >= 0 ? "gain" : "loss"}>{formatPercent(item.finalReturnPercent)}</strong></div>
            </article>
          ))}
        </div>
      ) : <p className="empty-state">이미 모든 투자를 정산했습니다.</p>}
      <button className="primary-button" onClick={onContinue}>내 결과 확인하기</button>
    </main>
  );
}
