import Store from "./store";
import pomodoro, {
  durations,
  Phase,
  makePomodoroState,
  State as SomodoroState,
} from "./pomodoro";
import playIcon from "./play-icon.svg";
import pauseIcon from "./pause-icon.svg";
import notificationSoundFile from "./notification-sound.ogg";
import createProgressRing from "./progress-ring";

const notificationSound = new Audio(notificationSoundFile);

const notificationMessages = {
  [Phase.FOCUS]: "Time to focus!",
  [Phase.SHORT_BREAK]: "Time to do a short break!",
  [Phase.LONG_BREAK]: "Time to do a long break!",
};

interface State {
  running: boolean;
  skipped: boolean;
  pomodoro: SomodoroState;
}

const initialState: State = {
  running: false,
  skipped: false,
  pomodoro: makePomodoroState(Phase.FOCUS),
};

function formatRemaining(remaining: number) {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

function setActive(node: HTMLElement, active: boolean) {
  if (active) {
    node.classList.add("active");
  } else {
    node.classList.remove("active");
  }
}

function main() {
  const store = new Store(initialState);
  const [
    remaining,
    focusButton,
    shotBreakButton,
    longBreakButton,
    playPauseButton,
  ]: HTMLElement[] = [
    "remaining",
    "focus-button",
    "shot-break-button",
    "long-break-button",
    "play-pause-button",
  ].map(document.getElementById.bind(document));

  const tomatos = document.querySelectorAll(".tomatos i");

  const progressRing = createProgressRing(
    document.getElementById("progress-ring"),
    4,
    130,
    0
  );

  createProgressRing(
    document.getElementById("progress-ring-background"),
    4,
    130,
    100
  );

  function render() {
    const { running, pomodoro } = store.state;
    const timeRemaining = formatRemaining(pomodoro.remaining);

    document.title = `(${running ? "▶" : "◼"} ${timeRemaining}) Smooth Tomato`;

    document.body.className = pomodoro.phase.toLowerCase();
    remaining.textContent = timeRemaining;

    setActive(focusButton, pomodoro.phase === Phase.FOCUS);
    setActive(shotBreakButton, pomodoro.phase === Phase.SHORT_BREAK);
    setActive(longBreakButton, pomodoro.phase === Phase.LONG_BREAK);

    Array.from(tomatos).forEach((tomato: HTMLElement, index) => {
      setActive(tomato, index === pomodoro.cycleCount);
    });

    progressRing.setProgress(
      ((durations[pomodoro.phase] - pomodoro.remaining) /
        durations[pomodoro.phase]) *
        100
    );

    (playPauseButton.firstChild as HTMLImageElement).src = running
      ? pauseIcon
      : playIcon;
  }

  function toggleRunning() {
    store.setState({
      ...store.state,
      running: !store.state.running,
    });
  }

  function tick() {
    if (store.state.running) {
      store.setState({
        ...store.state,
        skipped: false,
        pomodoro: pomodoro(store.state.pomodoro),
      });
    }
  }

  function skipTo(phase: Phase) {
    return () =>
      store.setState({
        ...store.state,
        running: true,
        skipped: true,
        pomodoro: makePomodoroState(phase),
      });
  }

  function notify(state: State, prevState: State) {
    if (!state.skipped && state.pomodoro.phase !== prevState.pomodoro.phase) {
      new Notification(notificationMessages[state.pomodoro.phase]);
      notificationSound.play();
    }
  }

  render();
  setInterval(tick, 1000);

  store.subscribe(render);
  store.subscribe(notify);

  playPauseButton.addEventListener("click", toggleRunning);
  focusButton.addEventListener("click", skipTo(Phase.FOCUS));
  shotBreakButton.addEventListener("click", skipTo(Phase.SHORT_BREAK));
  longBreakButton.addEventListener("click", skipTo(Phase.LONG_BREAK));
  window.addEventListener("keydown", (e) => {
    if (e.keyCode === 32) {
      toggleRunning();
    }
  });
}

Notification.requestPermission();
main();
