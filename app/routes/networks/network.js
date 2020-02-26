import Route from '@ember/routing/route';

export default class NetworksNetworkRoute extends Route {
  model(params) {
    return this.store.findRecord('network', params.network_id);
  }
}
