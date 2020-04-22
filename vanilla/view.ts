import playIcon from "../common/play-icon.svg";
import pauseIcon from "../common/pause-icon.svg";
import { Phase, Durations } from "../common/pomodoro";
import { $, formatRemaining } from "../common/utils";
import createProgressRing from "./lib/progress-ring";
import { State } from "./store";

const themeColors = {
  [Phase.FOCUS]: "#e74c3c",
  [Phase.SHORT_BREAK]: "#3498db",
  [Phase.LONG_BREAK]: "#27ae60",
};

export default function view({
  durations,
  onPlayPauseButtonClick,
  onFocusButtonClick,
  onShotBreakButtonClick,
  onLongBreakButtonClick,
}: {
  durations: Durations;
  onPlayPauseButtonClick: () => void;
  onFocusButtonClick: () => void;
  onShotBreakButtonClick: () => void;
  onLongBreakButtonClick: () => void;
}) {
  const tomatos = $(".tomatos");
  const remaining = $("#remaining");
  const themeColor = $('meta[name="theme-color"]');
  const focusButton = $("#focus-button") as HTMLButtonElement;
  const shotBreakButton = $("#shot-break-button") as HTMLButtonElement;
  const longBreakButton = $("#long-break-button") as HTMLButtonElement;
  const playPauseButton = $("#play-pause-button") as HTMLButtonElement;
  const progressRing = createProgressRing($("#progress-ring"), 4, 130, 0);

  createProgressRing($("#progress-ring-background"), 4, 130, 100);

  playPauseButton.addEventListener("click", onPlayPauseButtonClick);
  focusButton.addEventListener("click", resetFocus(onFocusButtonClick));
  shotBreakButton.addEventListener("click", resetFocus(onShotBreakButtonClick));
  longBreakButton.addEventListener("click", resetFocus(onLongBreakButtonClick));

  function resetFocus<T extends Function>(func: T) {
    return (((...args) => {
      playPauseButton.focus();
      return func(...args);
    }) as unknown) as T;
  }

  function render({ running, pomodoro }: State) {
    const { phase } = pomodoro;
    const timeRemaining = formatRemaining(pomodoro.remaining);
    const title = `(${running ? "▶" : "◼"} ${timeRemaining}) Smooth Tomato`;

    document.title = title;

    document.body.className = phase.toLowerCase();

    themeColor.setAttribute("content", themeColors[phase]);

    remaining.textContent = timeRemaining;

    focusButton.classList.toggle("active", phase === Phase.FOCUS);
    shotBreakButton.classList.toggle("active", phase === Phase.SHORT_BREAK);
    longBreakButton.classList.toggle("active", phase === Phase.LONG_BREAK);

    Array.from(tomatos.children).forEach((tomato, index) => {
      tomato.classList.toggle("active", index === pomodoro.cycleCount);
    });

    (playPauseButton.firstChild as HTMLImageElement).src = running
      ? pauseIcon
      : playIcon;

    progressRing.setProgress(
      ((durations[phase] - pomodoro.remaining) / durations[phase]) * 100
    );
  }

  return { render };
}
