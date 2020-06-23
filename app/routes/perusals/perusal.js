import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class PerusalsPerusalRoute extends Route {

  @service measurementInitializer;

  model(params) {
    const peekModel = this.store.peekRecord('perusal', params.perusal_id);
    if ( peekModel && ! peekModel.name) {
      // assume only type/id loaded
      return peekModel.reload();
    }
    return this.store.findRecord('perusal', params.perusal_id, { reload: true })
    .then(p => {
      return RSVP.hash({
            model: p
      });
    })
    .then(hash => {
      const p = hash.model;
      return RSVP.hash({
            model: p,
            curr: p.get('curr')
      });
    })
    .then(hash => {
      return RSVP.hash({
            model: hash.model,
            quakeHash: hash.model.curr.get('quake'),
            stationHash: hash.model.curr.get('station'),
            waveHash: hash.model.curr.get('ecps')
      });
    })
    .then(hash => {
      return RSVP.hash({
            model: hash.model,
            currHash: hash.model.hashQuakeStation(hash.model.get('curr')),
            ecpsHash: hash.model.curr.get('ecps')
      });
    })
    .then(hash => {
      return RSVP.hash({
            model: hash.model,
            channelsHash: RSVP.all(Array.from(hash.model.curr.get('ecps')))
      });
    })
    .then(hash => {
      return RSVP.hash({
            model: hash.model,
            channelsHash: RSVP.all(Array.from(hash.model.curr.get('ecps').map(qv => qv.get('channels')))),
            waveHash: RSVP.all(Array.from(hash.model.curr.get('ecps').map(qv => qv.get('waveforms')))),
      });
    })
    .then(hash => {
      return RSVP.hash({
            model: hash.model,
            waveHash: hash.waveHash,
            waveHashHash: RSVP.all(Array.from(hash.model.curr.get('ecps').map(qv => qv.get('waveforms').get('dataUrl'))))
      });
    })
    .then(hash => {
      return hash.model;
    });
  }

  afterModel(model, transition) {
    const measurementInitializer = this.measurementInitializer;
    return RSVP.hash({
      model: model,
      currHash: model.hashQuakeStation(model.get('curr')),
      toolHash: RSVP.all(model.get('tools').getEach('name'))
    }).then(function(hash) {
      const curr = hash.model.get('curr');
      const tools = hash.model.get('tools');
      measurementInitializer.checkNeedCreate(tools, curr);
      return hash.model;
    });
  }
}
