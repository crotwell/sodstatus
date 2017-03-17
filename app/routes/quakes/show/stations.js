import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.modelFor('quakes.show');
  },
  afterModel: function(model, transition) {
    return Ember.RSVP.hash({
      espsHash: model.get('esps'),
      stationHash: Ember.RSVP.all(model.get('esps').getEach('station')),
      latHash: Ember.RSVP.all(model.get('esps').getEach('station').getEach('latitude')),
      netHash: Ember.RSVP.all(model.get('esps').getEach('station').getEach('network'))
    });
  }

});
