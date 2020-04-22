import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class StationsStationRoute extends Route {
  model(params) {
    return this.store.findRecord('station', params.station_id).then(station => {
      return RSVP.hash({
        network: station.network,
        station: station
      }).then(hash => hash.station);
    });
  }
}
