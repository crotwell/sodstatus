import Ember from 'ember';

export default Ember.Route.extend({
  afterModel: function(model, transition) {
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
                  .then(function(o) {return o.get('latitude');})
            });
          } else { return null;}
      }),
      nextHash: model.get('next').then(function(qs) {
          if (qs) {
            return Ember.RSVP.hash({ 
              staHash: qs.get('station'),
              quakeHash: qs.get('quake').then(function(q) {return q.get('prefOrigin');})
            });
          } else { return null;}
      }),
      toolHash: Ember.RSVP.all(model.get('tools').getEach('toolName'))
        .then(t => {console.log("after model tools length: "+t.length);return t;})
    });
  }
});
