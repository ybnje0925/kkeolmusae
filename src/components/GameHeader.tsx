import { ChevronDown, WalletCards } from "lucide-react";
import type { Position } from "@/types/game";
import { anonymousLabel, formatPercent, formatWon } from "@/lib/formatters";
import { totalAssets } from "@/lib/portfolio";

const STAGE_LABELS = {
  ROUND_TRANSITION: "시간 이동",
  REVIEW_HOLDINGS: "보유 자산 확인",
  NEW_INVESTMENT: "새로운 투자",
  INVESTMENT_CONFIRM: "투자 완료",
  FINAL_SETTLEMENT: "최종 정산",
  RESULT: "결과",
} as const;

interface Props {
  phase: keyof typeof STAGE_LABELS;
  year: string;
  cash: number;
  positions: Position[];
  round: number;
  totalRounds: number;
}

export function GameHeader({ phase, year, cash, positions, round, totalRounds }: Props) {
  const assets = totalAssets(cash, positions);
  const progress = Math.min((round / totalRounds) * 100, 100);
  return (
    <header className="game-header">
      <div className="header-topline">
        <div>
          <span className="stage-label">{STAGE_LABELS[phase]}</span>
          <strong className="header-year">{year}</strong>
        </div>
        <span className="round-label">{round} / {totalRounds}</span>
      </div>
      <div className="progress-track" aria-label={`게임 진행률 ${Math.round(progress)}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="asset-strip">
        <div><span>총자산</span><strong>{formatWon(assets)}</strong></div>
        <div><span>현금</span><strong>{formatWon(cash)}</strong></div>
        <div><span>보유</span><strong>{positions.length}</strong></div>
      </div>
      {positions.length > 0 ? (
        <details className="portfolio-details">
          <summary><WalletCards size={15} /> 포트폴리오 펼치기 <ChevronDown size={15} /></summary>
          <div className="portfolio-list">
            {positions.map((position) => (
              <div key={position.id}>
                <span>{anonymousLabel(position.anonymousNumber)}</span>
                <span>{formatWon(position.currentValue)} <em className={position.returnPercent >= 0 ? "gain" : "loss"}>{formatPercent(position.returnPercent)}</em></span>
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </header>
  );
}
