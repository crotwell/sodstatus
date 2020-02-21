import Route from '@ember/routing/route';

export default class RecipeRoute extends Route {
  model() {
    return this.store.queryRecord('sodConfig', { current: true });
  }
}
