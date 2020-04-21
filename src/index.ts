import { Phase } from "./lib/pomodoro";
import createStore, { State } from "./store";
import createView from "./view";
import notificationSoundFile from "./notification-sound.ogg";

const notificationMessages = {
  [Phase.FOCUS]: "Time to focus!",
  [Phase.SHORT_BREAK]: "Time to do a short break!",
  [Phase.LONG_BREAK]: "Time to do a long break!",
};

const durations = {
  [Phase.FOCUS]: 25 * 60,
  [Phase.SHORT_BREAK]: 5 * 60,
  [Phase.LONG_BREAK]: 15 * 60,
};

const notificationSound = new Audio(notificationSoundFile);

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
      new Notification(notificationMessages[state.pomodoro.phase]);
      notificationSound.play();
    }
  });

  window.addEventListener("keydown", (e) => {
    const target = e.target as HTMLElement;

    if (e.keyCode === 32 && target.tagName !== "BUTTON") {
      store.toggleRunning();
    }
  });
}

Notification.requestPermission();
main();
