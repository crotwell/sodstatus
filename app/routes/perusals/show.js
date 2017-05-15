import Ember from 'ember';
import DS from 'ember-data';


export default Ember.Route.extend({
  measurementInit: Ember.inject.service('measurement-initializer'),
  afterModel: function(model, transition) {
    let measurementInit = this.get('measurementInit');
    return Ember.RSVP.hash({
      prevHash: model.get('prev').then(function(qs) {
          if (qs) {
            return Ember.RSVP.hash({ 
              staHash: qs.get('station'),
              quakeHash: qs.get('quake').then(function(q) {return q.get('prefOrigin');})
            });
          } else { return null;}
      }),
      currHash: model.get('curr').then(function(qs) {
          if (qs) {
            return Ember.RSVP.hash({ 
              staHash: qs.get('station'),
              quakeHash: qs.get('quake')
                  .then(function(q) {return q.get('prefOrigin');})
                  .then(function(o) {return o.get('latitude');}),
              measurementHas: qs.get('measurements')
            });
          } else { return null;}
      }),
      nextHash: model.get('next').then(function(qs) {
          if (qs == null) {
            return null;
          } else {
            return Ember.RSVP.hash({ 
              staHash: qs.get('station'),
              quakeHash: qs.get('quake').then(function(q) {return q.get('prefOrigin');}),
              measurementsHash: qs.get('measurements')
            });
          }
      }),
      toolHash: Ember.RSVP.all(model.get('tools').getEach('name'))
        .then(t => {console.log("after model tools length: "+t.length);return t;})
    }).then(function() {
      if (measurementInit.checkNeedCreate(model.get('tools'), model.get('curr'))) {
      console.log("route: perusal: created measurements");
      }
    });
  }
});
