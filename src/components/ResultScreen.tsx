import { RotateCcw, Share2, TrendingDown, TrendingUp } from "lucide-react";
import type { GameResult } from "@/types/game";
import { anonymousLabel, formatKoreanAmount, formatPercent, formatWon } from "@/lib/formatters";

interface Props {
  result: GameResult;
  startingCash: number;
  onRestart: () => void;
}

export function ResultScreen({ result, startingCash, onRestart }: Props) {
  const share = async () => {
    const text = `껄무새 결과 🦜\n${formatKoreanAmount(startingCash)} → ${formatKoreanAmount(result.finalAsset)}\n수익률 ${formatPercent(result.totalReturnPercent)}\n투자 유형: ${result.archetype.title}\n“${result.quote}”`;
    if (navigator.share) {
      try { await navigator.share({ title: "껄무새 결과", text }); return; } catch { return; }
    }
    await navigator.clipboard.writeText(text);
    window.alert("결과를 클립보드에 복사했습니다.");
  };

  return (
    <main className="screen result-screen">
      <section className="result-hero">
        <p className="eyebrow">시간여행 종료</p>
        <div className="result-comparison">
          <div><span>시작 자산</span><strong>{formatWon(startingCash)}</strong></div>
          <div className="result-arrow">→</div>
          <div><span>최종 자산</span><strong>{formatWon(result.finalAsset)}</strong><small>{formatKoreanAmount(result.finalAsset)}</small></div>
        </div>
        <div className={`total-return ${result.totalReturnPercent >= 0 ? "positive" : "negative"}`}>
          <span>총 수익률</span><strong>{formatPercent(result.totalReturnPercent)}</strong>
        </div>
      </section>

      <section className="result-grid">
        {result.best ? <article className="result-card"><div className="result-card-title"><TrendingUp size={18} /><span>최고의 투자</span></div><p>{anonymousLabel(result.best.anonymousNumber)}</p><h3>{result.best.revealName}</h3><strong className="gain">{formatPercent(result.best.finalReturnPercent)}</strong></article> : null}
        {result.worst ? <article className="result-card"><div className="result-card-title"><TrendingDown size={18} /><span>최악의 투자</span></div><p>{anonymousLabel(result.worst.anonymousNumber)}</p><h3>{result.worst.revealName}</h3><strong className="loss">{formatPercent(result.worst.finalReturnPercent)}</strong></article> : null}
      </section>

      {result.missed ? (
        <section className="missed-card">
          <p className="eyebrow">가장 아쉬운 선택</p>
          <div className="missed-title"><div><span>{anonymousLabel(result.missed.decision.card.anonymousNumber, result.missed.decision.card.assetClass)}</span><h3>{result.missed.decision.card.revealName}</h3></div><span className="parrot-large">🦜</span></div>
          <div className="missed-stats">
            <div><span>당신의 투자</span><strong>{result.missed.decision.percent}%</strong></div>
            <div><span>실제 기간 수익률</span><strong className="gain">{formatPercent(result.missed.returnPercent)}</strong></div>
          </div>
          <div className="what-if"><span>그때 현금 100%를 투자했다면</span><strong>{formatWon(result.missed.hypotheticalValue)}</strong></div>
          <blockquote>“살껄…”</blockquote>
        </section>
      ) : null}

      <section className="archetype-card">
        <span>나의 투자 유형</span>
        <h2>{result.archetype.title}</h2>
        <p>{result.archetype.description}</p>
        <div className="parrot-quote"><span>🦜</span><p>“{result.quote}”</p></div>
      </section>

      <div className="result-actions">
        <button className="secondary-button" onClick={() => void share()}><Share2 size={18} /> 결과 공유하기</button>
        <button className="primary-button" onClick={onRestart}><RotateCcw size={18} /> 다시 과거로</button>
      </div>
      <p className="data-note">수익률은 저장된 역사적 수정주가 기준이며, 세금·수수료·환율·배당 재투자는 반영하지 않습니다.</p>
    </main>
  );
}
