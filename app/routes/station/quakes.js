import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.modelFor('station');
  },
  afterModel: function(model, transition) {
      return Ember.RSVP.hash({
        netHash: model.get('network'),
        chanHash: model.get('channels'),
        qHash: model.get('quakes'),
        espsHash: Ember.RSVP.all(model.get('esps').getEach('quake')),
        espsHash2: Ember.RSVP.all(model.get('esps').getEach('quake').getEach('prefOrigin')),
        quakesHash: Ember.RSVP.all(model.get('quakes').getEach('prefOrigin')),
        quakesLatHash: Ember.RSVP.all(model.get('quakes').getEach('prefOrigin').getEach('latitude')),
        originHash: model.get('originList'),
        originLatHash: Ember.RSVP.all(model.get('originList').getEach('latitude')),
      });
  }
});
