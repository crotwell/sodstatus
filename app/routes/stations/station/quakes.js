import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class StationsStationQuakesRoute extends Route {
  model(params) {
    let parentModel = this.modelFor('stations.station');
    return RSVP.hash({
        model: parentModel,
        quakeStationPairHash: parentModel.get('quakeStationPairs')
      }).then(hash => {
      console.log(`isArray: ${Array.isArray(hash.quakeStationPairHash)}`)
      return RSVP.hash({
        model: hash.model,
        quakeStationPairHash: hash.quakeStationPairHash,
        qspAll: RSVP.all(Array.from(hash.quakeStationPairHash))
      });
    }).then(hash => {
      console.log(`isArray: ${Array.isArray(hash.quakeStationPairHash)}`)
      return RSVP.hash({
        model: hash.model,
        quakeStationPairHash: hash.quakeStationPairHash,
        qspAll: RSVP.all(Array.from(hash.model.quakeStationPairs.map(q => q.quake)))
      });
    }).then(hash => {
      for (let x in Array.from(hash.model.quakeStationPairs)) {
        console.log(`print cse ${x} ${typeof x}`);
      }
      return hash.model
    });
  }
}
