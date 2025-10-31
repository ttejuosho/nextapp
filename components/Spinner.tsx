// components/Spinner.tsx
"use client";
export default function Spinner({ size = 40 }: { size?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-block"
      style={{ width: size, height: size }}
    >
      <svg
        className="animate-spin"
        viewBox="0 0 50 50"
        style={{ width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeOpacity="0.15"
        />
        <path
          d="M45 25a20 20 0 0 1-20 20"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="sr-only">Loading</span>
    </div>
  );
}
