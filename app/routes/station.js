import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.findRecord('station', params.station_id);
  },
  afterModel: function(model, transition) {
      return Ember.RSVP.hash({
        netHash: model.get('network'),
        chanHash: model.get('channels'),
        qHash: model.get('quakes'),
        quakesHash: Ember.RSVP.all(model.get('quakes').getEach('prefOrigin'))
      });
  }
});
