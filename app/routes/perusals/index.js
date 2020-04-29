import Route from '@ember/routing/route';

export default class PerusalsIndexRoute extends Route {
  model() {
    return this.store.findAll('perusal');
  }
}
