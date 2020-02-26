import Route from '@ember/routing/route';


export default class NetworksRoute extends Route {
  model() {
    return this.store.findAll('network');
  }
}
