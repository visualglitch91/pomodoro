export function formatRemaining(remaining: number) {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

export function cx(...args: any[]) {
  return args.filter((className) => typeof className === "string").join(" ");
}

export function times<T>(number: number, handler: (index: number) => T) {
  return Array(number)
    .fill(null)
    .map((_, index) => handler(index));
}

export function $<T extends Element>(selector: string): T {
  return document.querySelector(selector);
}

export function onSpacebar(handler: () => void) {
  window.addEventListener("keydown", (e) => {
    const target = e.target as HTMLElement;

    if (e.keyCode === 32 && target.tagName !== "BUTTON") {
      handler();
    }
  });
}
