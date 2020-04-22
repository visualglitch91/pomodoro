import notificationSoundFile from "./notification-sound.ogg";
import { Phase } from "./pomodoro";

const notificationMessages = {
  [Phase.FOCUS]: "Time to focus!",
  [Phase.SHORT_BREAK]: "Time to do a short break!",
  [Phase.LONG_BREAK]: "Time to do a long break!",
};

const notificationSound = new Audio(notificationSoundFile);

Notification.requestPermission();

export default function notify(phase: Phase) {
  new Notification(notificationMessages[phase]);
  notificationSound.play();
}
