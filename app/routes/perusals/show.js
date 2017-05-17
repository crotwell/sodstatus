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
    }).then(function() {
      if (measurementInit.checkNeedCreate(model.get('tools'), model.get('curr'))) {
      console.log("route: perusal: created measurements");
      }
    });
  }
});
