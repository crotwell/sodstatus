import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class PerusalsPerusalRoute extends Route {

  @service measurementInitializer;

  model(params) {
    console.log(`model for perusal  ${params.perusal_id}`);
    const peekModel = this.store.peekRecord('perusal', params.perusal_id);
    if ( peekModel && ! peekModel.name) {
      // assume only type/id loaded
      return peekModel.reload();
    }
    return this.store.findRecord('perusal', params.perusal_id, { reload: true })
    .then(p => {
      console.log(`hashing 0 model for perusal ${p.id} ${p.name}`);
      return RSVP.hash({
            model: p
      });
    })
    .then(hash => {
      const p = hash.model;
      console.log(`hashing 1 model for perusal ${p.id} ${p.name}`);
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
            currHash: hash.model.hashQuakeStation(hash.model.get('curr')),
            ecpsHash: hash.model.curr.get('ecps')
      });
    })
    .then(hash => {
      console.log(`hashing 3.5 model for perusal ${hash.model.id} ${hash.ecpsHash} ${hash.model.curr.get('ecps')}`);
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
      });
    })
    .then(hash => {
      console.log(`hashing 5 model for perusal ${hash.model.id} ${hash.model.name}`);
      return RSVP.hash({
            model: hash.model,
            waveHash: hash.waveHash,
            waveHashHash: RSVP.all(Array.from(hash.model.curr.get('ecps').map(qv => qv.get('waveforms').get('dataUrl'))))
      });
    })
    .then(hash => {
      console.log(`hashing 6 ${hash.waveHash.length} ${hash.waveHashHash.length}`)
      return hash.model;
    });
  }

  afterModel(model, transition) {
    const measurementInitializer = this.measurementInitializer;
    return RSVP.hash({
      model: model,
      currHash: model.hashQuakeStation(model.get('curr')),
      toolHash: RSVP.all(model.get('tools').getEach('name'))
        .then(t => {console.log("after model tools length: "+t.length);return t;})
    }).then(hash => {
      let curr = hash.model.get('curr');
      if (curr)
      console.log("hash done: hash="+hash.currHash+" slat"+curr.get('station').get('latitude')+"  q lat="+curr.get('quake').get('prefOrigin').get('latitude'));
      else
      console.log("curr is null");
      return hash;
    }).then(function(hash) {
      const curr = hash.model.get('curr');
      const tools = hash.model.get('tools');
      console.log(`just making sure curr not null: ${curr.get('distDegFormatted')}`);
      if (measurementInitializer.checkNeedCreate(tools, curr)) {
      console.log("route: perusal: created measurements");
      }
      return hash.model;
    });
  }
}
