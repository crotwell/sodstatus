import Route from '@ember/routing/route';

export default class QuakesIndexRoute extends Route {
  model() {
    return this.store.findAll('quake');
  }
}
