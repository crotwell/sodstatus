import Route from '@ember/routing/route';

export default class ArmsRoute extends Route {
  model() {
    return this.store.findAll('arm');
  }
}
