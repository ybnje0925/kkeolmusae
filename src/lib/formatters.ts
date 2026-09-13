const won = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

export function formatWon(value: number): string {
  return won.format(Math.round(value));
}

export function formatPercent(value: number): string {
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : ""}${rounded.toLocaleString("ko-KR")}%`;
}

export function formatKoreanAmount(value: number): string {
  const rounded = Math.round(value / 10000) * 10000;
  const eok = Math.floor(rounded / 100000000);
  const man = Math.floor((rounded % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok.toLocaleString()}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok.toLocaleString()}억원`;
  return `${man.toLocaleString()}만원`;
}

export function getYear(date: string): string {
  return date.slice(0, 4);
}

export function anonymousLabel(number: number, assetClass = "stock"): string {
  const kind = assetClass === "stock" ? "기업" : "자산";
  return `${kind} #${String(number).padStart(2, "0")}`;
}
