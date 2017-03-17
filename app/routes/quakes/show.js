import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var e = this.store.findRecord('quake', params.quake_id);
    return e;
  },
  afterModel: function(model, transition) {
    return Ember.RSVP.hash({
      espsHash: model.get('esps'),
      stationHash: Ember.RSVP.all(model.get('esps').getEach('station')),
      quakesHash: model.get('prefOrigin'),
      originLatHash: model.get('prefOrigin').get('latitude'),
      originLonHash: model.get('prefOrigin').get('longitude'),
    });
  }
});
