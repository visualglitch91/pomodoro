import { Phase } from "../common/pomodoro";
import notify from "../common/notify";
import createStore from "./store";
import createView from "./view";
import { onSpacebar } from "../common/utils";
import { durations, themeColors } from "../common/config";

function main() {
  const store = createStore(durations);

  const view = createView({
    durations,
    themeColors,
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
