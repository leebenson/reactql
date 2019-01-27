import { action, observable } from "mobx";

export class State {
  @observable count = 0;
  @action public increment = () => {
    console.log("current:", this.count);
    this.count = this.count + 1;
  };
  @action public decrement = () => {
    --this.count;
  };
}
