import { ArrowDown } from "lucide-react";
import { getYear } from "@/lib/formatters";

interface Props {
  fromDate?: string;
  toDate: string;
  onContinue: () => void;
}

export function YearTransition({ fromDate, toDate, onContinue }: Props) {
  const from = fromDate ? getYear(fromDate) : "현재";
  const to = getYear(toDate);
  const years = fromDate ? Math.max(Number(to) - Number(from), 0) : null;
  return (
    <main className="screen transition-screen">
      <p className="eyebrow">시간 이동</p>
      <div className="time-tunnel" aria-label={`${from}년에서 ${to}년으로 이동`}>
        <span>{from}</span>
        <ArrowDown size={28} aria-hidden="true" />
        <strong>{to}</strong>
      </div>
      <p>{years === null ? "첫 번째 선택의 순간으로 돌아갑니다." : years === 0 ? "같은 해, 시장은 다시 움직였습니다." : `${years}년이 흘렀습니다.`}</p>
      <button className="primary-button" onClick={onContinue}>이 시점으로 이동</button>
    </main>
  );
}
