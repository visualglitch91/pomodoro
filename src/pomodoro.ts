export enum Phase {
  FOCUS = "focus",
  SHORT_BREAK = "short-break",
  LONG_BREAK = "long-break",
}

export const durations = {
  [Phase.FOCUS]: 25 * 60,
  [Phase.SHORT_BREAK]: 5 * 60,
  [Phase.LONG_BREAK]: 15 * 60,
};

export interface State {
  remaining: number;
  phase: Phase;
  cycleCount: number;
}

export function makePomodoroState(phase: Phase): State {
  return { phase, remaining: durations[phase], cycleCount: 0 };
}

export default function pomodoro(prevState: State): State {
  const state = { ...prevState, remaining: prevState.remaining - 1 };

  if (state.remaining < 0) {
    switch (state.phase) {
      case Phase.FOCUS:
        state.phase =
          state.cycleCount >= 3 ? Phase.LONG_BREAK : Phase.SHORT_BREAK;
        break;
      case Phase.LONG_BREAK:
        state.phase = Phase.FOCUS;
        state.cycleCount = 0;
        break;
      case Phase.SHORT_BREAK:
        state.phase = Phase.FOCUS;
        state.cycleCount++;
        break;
    }

    state.remaining = durations[state.phase];
  }

  return state;
}
