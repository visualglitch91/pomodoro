import { Phase } from "./pomodoro";

export const durations = {
  [Phase.FOCUS]: 25 * 60,
  [Phase.SHORT_BREAK]: 5 * 60,
  [Phase.LONG_BREAK]: 15 * 60,
};

export const themeColors = {
  [Phase.FOCUS]: "#e74c3c",
  [Phase.SHORT_BREAK]: "#3498db",
  [Phase.LONG_BREAK]: "#27ae60",
};
