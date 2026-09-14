interface SetupEmblemProps {
  className?: string;
}

const BUILDINGS = [
  { x: 18, y: 66, w: 10, h: 30 },
  { x: 30, y: 54, w: 9, h: 42 },
  { x: 41, y: 70, w: 10, h: 26 },
  { x: 53, y: 48, w: 9, h: 48 },
  { x: 64, y: 62, w: 11, h: 34 },
  { x: 77, y: 72, w: 9, h: 24 },
  { x: 88, y: 58, w: 10, h: 38 },
];

export default function SetupEmblem({ className }: SetupEmblemProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="none" stroke="#A8834A" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="48" fill="#1A181B" />

      <g transform="translate(78,38)">
        <circle cx="0" cy="0" r="12" fill="#A8834A" />
        <circle cx="4.5" cy="-3" r="10.5" fill="#1A181B" />
      </g>

      <g fill="#A8834A">
        <circle cx="30" cy="24" r="1" />
        <circle cx="40" cy="18" r="0.8" />
        <circle cx="24" cy="34" r="0.7" />
      </g>

      <g fill="#121113" stroke="#A8834A" strokeWidth="1">
        {BUILDINGS.map((b) => (
          <rect key={`${b.x}-${b.y}`} x={b.x} y={b.y} width={b.w} height={b.h} />
        ))}
      </g>
    </svg>
  );
}
