import Route from '@ember/routing/route';

export default class QuakesQuakeRoute extends Route {
  model(params) {
    return this.store.findRecord('quake', params.quake_id);
  }
}
