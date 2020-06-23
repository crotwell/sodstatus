import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class StationsStationQuakesRoute extends Route {
  model() {
    let parentModel = this.modelFor('stations.station');
    return RSVP.hash({
        model: parentModel,
        quakeStationPairHash: parentModel.get('quakeStationPairs')
      }).then(hash => {
      return RSVP.hash({
        model: hash.model,
        quakeStationPairHash: hash.quakeStationPairHash,
        qspAll: RSVP.all(Array.from(hash.quakeStationPairHash))
      });
    }).then(hash => {
      return RSVP.hash({
        model: hash.model,
        quakeStationPairHash: hash.quakeStationPairHash,
        qspAll: RSVP.all(Array.from(hash.model.quakeStationPairs.map(q => q.quake)))
      });
    }).then(hash => {
      return hash.model
    });
  }
}
