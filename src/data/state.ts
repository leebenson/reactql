import { action, observable } from "mobx";

export class State {
  @observable count = 0;
  @action public increment = () => {
    this.count = this.count + 1;
  };
  @action public decrement = () => {
    --this.count;
  };
}
