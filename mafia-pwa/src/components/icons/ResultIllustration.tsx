interface ResultIllustrationProps {
  winner: "mafia" | "civilians";
  className?: string;
}

const BUILDINGS = [
  { x: 0, y: 150, w: 28, h: 50 },
  { x: 32, y: 128, w: 22, h: 72 },
  { x: 58, y: 145, w: 26, h: 55 },
  { x: 88, y: 108, w: 20, h: 92 },
  { x: 112, y: 138, w: 32, h: 62 },
  { x: 148, y: 118, w: 22, h: 82 },
  { x: 174, y: 148, w: 28, h: 52 },
  { x: 206, y: 98, w: 18, h: 102 },
  { x: 228, y: 132, w: 26, h: 68 },
  { x: 258, y: 144, w: 24, h: 56 },
  { x: 286, y: 122, w: 24, h: 78 },
  { x: 314, y: 140, w: 6, h: 60 },
];

export default function ResultIllustration({ winner, className }: ResultIllustrationProps) {
  if (winner === "mafia") {
    return (
      <svg viewBox="0 0 320 200" className={className} role="img" aria-hidden="true">
        <rect width="320" height="200" fill="#121113" />

        <g fill="#A8834A">
          <circle cx="42" cy="28" r="1.4" />
          <circle cx="90" cy="46" r="1.1" />
          <circle cx="132" cy="22" r="1.3" />
          <circle cx="200" cy="34" r="1.1" />
          <circle cx="222" cy="60" r="1.3" />
        </g>

        <g transform="translate(252,44)">
          <circle cx="0" cy="0" r="24" fill="#A8834A" />
          <circle cx="9" cy="-6" r="21" fill="#121113" />
        </g>

        <g transform="translate(76,58)" fill="none" stroke="#8B2635" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-26 4c0-10 11-17 26-17s26 7 26 17v6c0 15-15 26-26 26s-26-11-26-26Z" />
          <circle cx="-11" cy="6" r="3.2" fill="#8B2635" stroke="none" />
          <circle cx="11" cy="6" r="3.2" fill="#8B2635" stroke="none" />
          <path d="M-13.5 1.5c1.5.9 3 .9 4.5 0" />
          <path d="M9 1.5c1.5.9 3 .9 4.5 0" />
        </g>

        <rect x="0" y="148" width="320" height="3" fill="#8B2635" opacity="0.65" />

        <g fill="#1A181B" stroke="#A8834A" strokeWidth="1" opacity="0.95">
          {BUILDINGS.map((b) => (
            <rect key={`${b.x}-${b.y}`} x={b.x} y={b.y} width={b.w} height={200 - b.y} />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-hidden="true">
      <rect width="320" height="200" fill="#121113" />

      <g stroke="#A8834A" strokeWidth="2" strokeLinecap="round">
        <line x1="160" y1="18" x2="160" y2="4" />
        <line x1="126" y1="28" x2="114" y2="16" />
        <line x1="194" y1="28" x2="206" y2="16" />
        <line x1="106" y1="56" x2="90" y2="50" />
        <line x1="214" y1="56" x2="230" y2="50" />
      </g>

      <circle cx="160" cy="146" r="56" fill="#A8834A" />

      <g fill="none" stroke="#A8834A" strokeWidth="1.5" strokeLinecap="round">
        <path d="M40 46 48 39 56 46" />
        <path d="M258 52 266 45 274 52" />
      </g>

      <rect x="0" y="148" width="320" height="3" fill="#A8834A" opacity="0.85" />

      <g fill="#2A2729" stroke="#A8834A" strokeWidth="1">
        {BUILDINGS.map((b) => (
          <rect key={`${b.x}-${b.y}`} x={b.x} y={b.y} width={b.w} height={200 - b.y} />
        ))}
      </g>
    </svg>
  );
}
