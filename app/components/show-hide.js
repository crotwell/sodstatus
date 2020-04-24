import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ShowHideComponent extends Component {
  @tracked hide = false;
  get isHidden() {
    return this.hide;
  }
  @action
  toggleHide() {
    this.hide = ! this.hide;
  }

  get buttonText() {
    return this.hide ? "Show" : "Hide";
  }

  @action
  showMe() {
    this.hide = false;
  }

  @action
  hideMe() {
    this.hide = true;
  }
}
