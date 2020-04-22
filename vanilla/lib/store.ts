export default class Store<T> {
  public state: T;
  private subscriptions = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  subscribe(handler) {
    this.subscriptions.push(handler);

    return () => {
      this.subscriptions = this.subscriptions.filter((it) => it !== handler);
    };
  }

  setState(nextState: T) {
    const prevState = this.state;
    this.state = nextState;
    this.subscriptions.forEach((hanlder) => hanlder(this.state, prevState));
  }
}
