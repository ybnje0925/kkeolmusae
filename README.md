# 껄무새 (Kkeolmusae)

회사 이름을 모른 채 당시의 단편적인 정보만 보고 투자하는 모바일 우선 시간여행 웹게임입니다.

매 라운드마다 시간순으로 묶인 익명 카드 3장이 제시됩니다. 플레이어는 라운드 시작 시점의 현금을 25% 단위로 세 자산에 나눠 배분하며, 합계 100%를 넘길 수 없습니다. 사용하지 않은 비중은 현금으로 남습니다.

## 실행

윈도우에서는 `껄무새_실행.bat`을 더블클릭하거나 다음 명령어를 사용합니다.

```bash
npm install
npm run dev
```

정적 프로덕션 빌드:

```bash
npm run build
```

## 가격 데이터

게임 중에는 외부 API를 호출하지 않습니다. 저장된 Yahoo Finance 역사적 `adjusted close`를 사용합니다.

```bash
npm run prices:fetch
```

- 진입일이 휴장일이면 다음 거래일 가격
- 평가일이 휴장일이면 직전 거래일 가격
- 주식분할 영향을 줄이기 위해 수정주가 사용
- 세금, 수수료, 환율, 배당 재투자는 미반영

## 주요 구조

- `src/lib/gameEngine.ts`: 24장 밸런스 셔플과 3장 단위 라운드 구성, 포지션 생성, 정산
- `src/lib/prices.ts`: 거래일 및 가격 조회
- `src/lib/portfolio.ts`: 평가액과 총자산 계산
- `src/lib/resultAnalysis.ts`: 최고·최악·놓친 수익·투자 성향 분석
- `src/components/Game.tsx`: 단계 기반 게임 상태 머신
