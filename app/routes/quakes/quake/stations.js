import Route from '@ember/routing/route';

export default class QuakesQuakeStationsRoute extends Route {
  model() {
    return this.modelFor('quakes.quake');
  }
}
