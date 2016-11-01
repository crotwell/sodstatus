import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.modelFor('station');
  },
  afterModel: function(model, transition) {
      return Ember.RSVP.hash({
        netHash: model.get('network'),
        espsHash: Ember.RSVP.all(model.get('esps').getEach('event')),
        eventsHash: model.get('events')
      });
  }
});
