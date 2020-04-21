export enum Phase {
  FOCUS = "focus",
  SHORT_BREAK = "short-break",
  LONG_BREAK = "long-break",
}

export type Durations = { [P in Phase]: number };

export interface State {
  remaining: number;
  phase: Phase;
  cycleCount: number;
}

export default function makePomodoro(durations: Durations) {
  function tick(prevState: State): State {
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

  function reset(phase: Phase = Phase.FOCUS): State {
    return { phase, remaining: durations[phase], cycleCount: 0 };
  }

  return { tick, reset };
}
