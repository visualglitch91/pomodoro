import { h, render, Fragment } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import playIcon from "../common/play-icon.svg";
import pauseIcon from "../common/pause-icon.svg";
import makePomodoro, { Phase } from "../common/pomodoro";
import { formatRemaining, times, cx, onSpacebar } from "../common/utils";
import notify from "../common/notify";
import { durations, themeColors } from "../common/config";
import ProgressRing from "./progress-ring";

const pomodoroUtils = makePomodoro(durations);

function App() {
  const tickRef = useRef<() => void>();
  const prevPhaseRef = useRef<Phase>();
  const playPauseButtonRef = useRef<HTMLButtonElement>();
  const [running, setRunning] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [pomodoro, setPomodoro] = useState(pomodoroUtils.reset());
  const timeRemaining = formatRemaining(pomodoro.remaining);
  const percent =
    ((durations[pomodoro.phase] - pomodoro.remaining) /
      durations[pomodoro.phase]) *
    100;

  function toggleRunning() {
    setRunning((x) => !x);
  }

  function resetTo(phase: Phase) {
    return () => {
      setPomodoro(pomodoroUtils.reset(phase));
      setSkipped(true);
      setRunning(true);
      playPauseButtonRef.current.focus();
    };
  }

  tickRef.current = () => {
    if (running) {
      setSkipped(false);
      setPomodoro(pomodoroUtils.tick(pomodoro));
    }
  };

  useEffect(() => {
    document.title = `(${running ? "▶" : "◼"} ${timeRemaining}) Smooth Tomato`;
  }, [running, timeRemaining]);

  useEffect(() => {
    if (
      !skipped &&
      prevPhaseRef.current &&
      prevPhaseRef.current !== pomodoro.phase
    ) {
      notify(pomodoro.phase);
    }

    prevPhaseRef.current = pomodoro.phase;
  }, [skipped, pomodoro.phase]);

  useEffect(() => {
    document.body.className = pomodoro.phase.toLowerCase();
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", themeColors[pomodoro.phase]);
  }, [pomodoro.phase]);

  useEffect(() => {
    setInterval(() => tickRef.current(), 1000);
    onSpacebar(toggleRunning);
  }, []);

  return (
    <Fragment>
      <div class="indicators">
        <ProgressRing
          id="progress-ring-background"
          stroke={4}
          radius={130}
          percent={100}
        />
        <ProgressRing
          id="progress-ring"
          stroke={4}
          radius={130}
          percent={percent}
        />
        <div class="indicators-inner">
          <div id="remaining">{timeRemaining}</div>
          <button
            id="play-pause-button"
            onClick={toggleRunning}
            ref={playPauseButtonRef}
          >
            <img src={running ? pauseIcon : playIcon} />
          </button>
        </div>
      </div>
      <div class="tomatos">
        {times(4, (index) => (
          <i
            key={index}
            class={index === pomodoro.cycleCount ? "active" : null}
          />
        ))}
      </div>
      <div>
        {[
          [Phase.FOCUS, "focus"],
          [Phase.SHORT_BREAK, "short break"],
          [Phase.LONG_BREAK, "long break"],
        ].map(([phase, label]: [Phase, string]) => (
          <button
            class={cx("phase", pomodoro.phase === phase && "active")}
            onClick={resetTo(phase)}
          >
            {label}
          </button>
        ))}
      </div>
    </Fragment>
  );
}

render(<App />, document.getElementById("root"));
