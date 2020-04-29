import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class PerusalsNewController extends Controller {
  @action
  save(model) {
    return this.transitionToRoute('perusals.perusal', model);
  }
  @action
  cancel() {
    return this.transitionToRoute('perusals');
  }
}
