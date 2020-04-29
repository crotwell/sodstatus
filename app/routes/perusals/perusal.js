import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class PerusalsPerusalRoute extends Route {

  @service measurementInitializer;

  model(params) {
    console.log(`model for perusal  ${params.perusal_id}`);
    return this.store.findRecord('perusal', params.perusal_id)
    .then(p => {
      console.log(`hashing model for perusal ${p.id} ${p.name}`);
      return RSVP.hash({
            model: p,
            curr: p.get('curr')
      });
    })
    .then(hash => {
      console.log(`hashing 2 model for perusal ${hash.model.id} ${hash.model.name}  ${hash.model.curr}`);
      return RSVP.hash({
            model: hash.model,
            quakeHash: hash.model.curr.get('quake'),
            stationHash: hash.model.curr.get('station'),
            waveHash: hash.model.curr.get('ecps')
      });
    })
    .then(hash => {
      console.log(`hashing 3 model for perusal ${hash.model.id} ${hash.model.curr.get('ecps')}`);
      return RSVP.hash({
            model: hash.model,
            channelsHash: RSVP.all(Array.from(hash.model.curr.get('ecps')))
      });
    })
    .then(hash => {
      console.log(`hashing 4 model for perusal ${hash.model.id} ${hash.model.name}`);
      return RSVP.hash({
            model: hash.model,
            channelsHash: RSVP.all(Array.from(hash.model.curr.get('ecps').map(qv => qv.get('channels')))),
            waveHash: RSVP.all(Array.from(hash.model.curr.get('ecps').map(qv => qv.get('waveforms')))),
            waveHashHash: RSVP.all(Array.from(hash.model.curr.get('ecps').map(qv => qv.get('waveforms').get('dataUrl'))))
      });
    })
    .then(hash => {
      console.log(`hashing 3 ${hash.waveHash.length} ${hash.waveHashHash.length}`)
      return hash.model;
    });
  }

  afterModel(model, transition) {
    const measurementInitializer = this.measurementInitializer;
    return RSVP.hash({
      currHash: model.hashQuakeStation(model.get('curr')),
      toolHash: RSVP.all(model.get('tools').getEach('name'))
        .then(t => {console.log("after model tools length: "+t.length);return t;})
   }).then(hash => {
let curr = model.get('curr');
if (curr)
console.log("hash done: hash="+hash.currHash+" slat"+curr.get('station').get('latitude')+"  q lat="+curr.get('quake').get('prefOrigin').get('latitude'));
else
console.log("curr is null");
    }).then(function() {
      if (measurementInitializer.checkNeedCreate(model.get('tools'), model.get('curr'))) {
      console.log("route: perusal: created measurements");
      }
    });
  }
}
