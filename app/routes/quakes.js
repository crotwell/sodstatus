import Route from '@ember/routing/route';

export default class QuakesRoute extends Route {
  model() {
    return this.store.findAll('quake');
  }
}
