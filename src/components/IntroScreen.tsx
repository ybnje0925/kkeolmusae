import { ArrowRight, Clock3 } from "lucide-react";

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="screen intro-screen">
      <div className="brand-mark" aria-hidden="true">🦜</div>
      <div className="intro-copy">
        <p className="eyebrow"><Clock3 size={14} /> 과거 투자 시뮬레이션</p>
        <h1>껄무새</h1>
        <p className="intro-question">“그때 샀으면 부자 됐다고?”</p>
        <p className="intro-sub">진짜 그때도 살 수 있었을까?</p>
        <p className="intro-description">
          회사 이름도, 미래도 알려주지 않습니다.<br />
          당시의 몇 가지 정보만 보고 투자하세요.
        </p>
      </div>

      <div className="start-panel">
        <div>
          <span>시작 자산</span>
          <strong>₩10,000,000</strong>
        </div>
        <button className="primary-button" onClick={onStart}>
          과거로 돌아가기 <ArrowRight size={20} />
        </button>
      </div>

      <p className="legal-copy">
        실제 과거 수정주가 데이터를 기반으로 한 투자 시뮬레이션입니다.<br />
        투자 조언이 아닙니다.
      </p>
    </main>
  );
}
