export default function progressRing(
  node: Element,
  stroke: number,
  radius: number,
  percent: number
) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const root = node.attachShadow({ mode: "open" });

  root.innerHTML = `
      <svg
        height="${radius * 2}"
        width="${radius * 2}"
       >
         <circle
           stroke="white"
           stroke-dasharray="${circumference} ${circumference}"
           style="stroke-dashoffset:${circumference}"
           stroke-width="${stroke}"
           fill="transparent"
           r="${normalizedRadius}"
           cx="${radius}"
           cy="${radius}"
        />
      </svg>

      <style>
        circle {
          transition: stroke-dashoffset 0.35s;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
        }
      </style>
    `;

  setProgress(percent);

  function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    const circle = root.querySelector("circle");
    circle.style.strokeDashoffset = offset.toString();
  }

  return { setProgress };
}
