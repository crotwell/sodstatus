import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.modelFor('station');
  },
  afterModel: function(model, transition) {
console.log("station afterModel");
      return Ember.RSVP.hash({
        netHash: model.get('network'),
        chanHash: model.get('channels'),
        qHash: model.get('quakes'),
        espsHash: Ember.RSVP.all(model.get('esps').getEach('quake')),
        quakesHash: Ember.RSVP.all(model.get('quakes').getEach('prefOrigin')),
        originHash: model.get('originList'),
        originLatHash: Ember.RSVP.all(model.get('originList').getEach('latitude')),
      });
  }
});
