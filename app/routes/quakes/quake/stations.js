import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class QuakesQuakeStationsRoute extends Route {
  model() {
    let parentModel = this.modelFor('quakes.quake');
    return RSVP.hash({
        model: parentModel,
        quakeStationPairHash: parentModel.get('quakeStationPairs')
    }).then(hash => {
      return RSVP.hash({
          model: hash.model,
          quakeStationPairHash: hash.quakeStationPairHash,
          stAll: RSVP.all(Array.from(hash.model.quakeStationPairs.map(q => q.station)))
      });
    }).then(hash => {
      return RSVP.hash({
          model: hash.model,
          quakeStationPairHash: hash.quakeStationPairHash,
          stAll: RSVP.all(Array.from(hash.model.quakeStationPairs.map(q => q.station))),
          netAll: RSVP.all(Array.from(hash.model.quakeStationPairs.map(q => q.station.get('network'))))
      });
    }).then(hash => {
      return RSVP.hash({
          model: hash.model,
          quakeStationPairHash: hash.quakeStationPairHash,
          stAll: RSVP.all(Array.from(hash.model.quakeStationPairs.map(q => q.station))),
          netAll: RSVP.all(Array.from(hash.model.quakeStationPairs.map(q => q.station.get('network').get('networkCode'))))
      });
    }).then(hash => hash.model);
  }
}
