import Ember from 'ember';
import DS from 'ember-data';


export default Ember.Route.extend({
  measurementInit: Ember.inject.service('measurement-initializer'),
  afterModel: function(model, transition) {
    let measurementInit = this.get('measurementInit');
    return Ember.RSVP.hash({
      currHash: model.hashQuakeStation(model.get('curr')),
      toolHash: Ember.RSVP.all(model.get('tools').getEach('name'))
        .then(t => {console.log("after model tools length: "+t.length);return t;})
   }).then(hash => {
let curr = model.get('curr');
if (curr)
console.log("hash done: hash="+hash.currHash+" slat"+curr.get('station').get('latitude')+"  q lat="+curr.get('quake').get('prefOrigin').get('latitude'));
else 
console.log("curr is null");
    }).then(function() {
      if (measurementInit.checkNeedCreate(model.get('tools'), model.get('curr'))) {
      console.log("route: perusal: created measurements");
      }
    });
  },

  actions: {
    willTransition(transition) {
        // waveforms are big, clean out store cache on transition
        this.get('store').unloadAll('waveform');
        return true;
    }
  }
});
