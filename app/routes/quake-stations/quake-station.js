import Route from '@ember/routing/route';

export default class QuakeStationsQuakeStationRoute extends Route {
  model(params) {
    return this.store.findRecord('quakeStation', params.quake_station_id);
  }
}
