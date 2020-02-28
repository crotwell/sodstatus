import Route from '@ember/routing/route';

export default class StationsStationRoute extends Route {
  model(params) {
    return this.store.findRecord('station', params.station_id);
  }
}
