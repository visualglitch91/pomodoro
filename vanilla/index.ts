import { Phase } from "../common/pomodoro";
import notify from "../common/notify";
import createStore from "./store";
import createView from "./view";
import { onSpacebar } from "../common/utils";

const durations = {
  [Phase.FOCUS]: 25 * 60,
  [Phase.SHORT_BREAK]: 5 * 60,
  [Phase.LONG_BREAK]: 15 * 60,
};

function main() {
  const store = createStore(durations);

  const view = createView({
    durations,
    onPlayPauseButtonClick: () => store.toggleRunning(),
    onFocusButtonClick: () => store.skip(Phase.FOCUS),
    onShotBreakButtonClick: () => store.skip(Phase.SHORT_BREAK),
    onLongBreakButtonClick: () => store.skip(Phase.LONG_BREAK),
  });

  setInterval(() => store.tick(), 1000);

  view.render(store.state);

  store.subscribe(() => view.render(store.state));

  store.subscribe((state, prevState) => {
    if (!state.skipped && state.pomodoro.phase !== prevState.pomodoro.phase) {
      notify(state.pomodoro.phase);
    }
  });

  onSpacebar(() => store.toggleRunning());
}

main();
