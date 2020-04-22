import { h } from "preact";

export default function ProgressRing({
  id,
  stroke,
  radius,
  percent,
}: {
  id?: string;
  stroke: number;
  radius: number;
  percent: number;
}) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div id={id}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="white"
          stroke-dasharray={`${circumference} ${circumference}`}
          stroke-width={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 0.35s",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
    </div>
  );
}
