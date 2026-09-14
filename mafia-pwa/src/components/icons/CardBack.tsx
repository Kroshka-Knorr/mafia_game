interface CardBackProps {
  className?: string;
}

const DIAMOND_GRID = [
  [48, 40],
  [96, 40],
  [144, 40],
  [48, 88],
  [144, 88],
  [48, 200],
  [144, 200],
  [48, 248],
  [96, 248],
  [144, 248],
];

export default function CardBack({ className }: CardBackProps) {
  return (
    <svg
      viewBox="0 0 192 288"
      className={className}
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="192" height="288" fill="#121113" />
      <rect
        x="10"
        y="10"
        width="172"
        height="268"
        fill="none"
        stroke="#A8834A"
        strokeWidth="1.5"
      />

      <g fill="none" stroke="#A8834A" strokeOpacity="0.35" strokeWidth="1">
        {DIAMOND_GRID.map(([cx, cy]) => (
          <path
            key={`${cx}-${cy}`}
            d={`M ${cx} ${cy - 12} L ${cx + 12} ${cy} L ${cx} ${cy + 12} L ${cx - 12} ${cy} Z`}
          />
        ))}
      </g>

      <circle cx="96" cy="144" r="38" fill="none" stroke="#8B2635" strokeWidth="3" />
      <circle cx="96" cy="144" r="27" fill="none" stroke="#A8834A" strokeWidth="1.5" />
      <path d="M 96 118 L 122 144 L 96 170 L 70 144 Z" fill="#8B2635" />
    </svg>
  );
}
