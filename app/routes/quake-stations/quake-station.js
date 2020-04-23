import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class QuakeStationsQuakeStationRoute extends Route {
  model(params) {
    return this.store.findRecord('quakeStation', params.quake_station_id)
    .then( quakeStation => {
      return RSVP.hash({
          model: quakeStation,
          quakeHash: quakeStation.get('quake'),
          stationHash: quakeStation.get('station')
      }).then(hash => {
        return RSVP.hash({
            model: hash.model,
            chAll: RSVP.all(Array.from(hash.model.get('station').get('channels'))),
            networkHash: hash.model.get('station').get('network')
        });
      }).then(hash => hash.model);
    });
  }
}
