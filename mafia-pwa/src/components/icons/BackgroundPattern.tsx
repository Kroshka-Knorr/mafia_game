export default function BackgroundPattern() {
  return (
    <div
      aria-hidden="true"
      className="bg-pattern-drift pointer-events-none absolute -inset-6 -z-10 opacity-[0.06]"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="setup-bg-diamonds"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 5 L35 20 L20 35 L5 20 Z"
              fill="none"
              stroke="#A8834A"
              strokeWidth="1.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#setup-bg-diamonds)" />
      </svg>
    </div>
  );
}
