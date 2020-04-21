import Store from "./lib/store";
import makePomodoro, {
  Phase,
  Durations,
  State as PomodoroState,
} from "./lib/pomodoro";

export interface State {
  running: boolean;
  skipped: boolean;
  pomodoro: PomodoroState;
}

export default function createStore(durations: Durations) {
  const pomodoro = makePomodoro(durations);

  const initialState: State = {
    running: false,
    skipped: false,
    pomodoro: pomodoro.reset(),
  };

  const store = new Store(initialState);

  return {
    get state() {
      return store.state;
    },
    subscribe(handler) {
      return store.subscribe(handler);
    },
    toggleRunning() {
      store.setState({
        ...store.state,
        running: !store.state.running,
      });
    },
    tick() {
      if (store.state.running) {
        store.setState({
          ...store.state,
          skipped: false,
          pomodoro: pomodoro.tick(store.state.pomodoro),
        });
      }
    },
    skip(phase: Phase) {
      store.setState({
        ...store.state,
        running: true,
        skipped: true,
        pomodoro: pomodoro.reset(phase),
      });
    },
  };
}
