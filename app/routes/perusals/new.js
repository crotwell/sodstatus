import Route from '@ember/routing/route';

export default class PerusalsNewRoute extends Route {
  model() {
    let p = this.store.createRecord('perusal', {
      name: 'perusal',
      username: 'defaultuser',
      eventSort: 'time',
      stationSort: 'alpha',
      primarySort: 'quake',
      first: null,
      prev: null,
      curr: null,
      next: null,
      tools: []
    });
    return p;
  }
}
