import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var esp = this.store.findRecord('quakeStation', params.esp_id);
    return esp;
  },
  afterModel: function(model, transition) {
    return Ember.RSVP.hash({
      staHash: model.station,
      ecpsHash: model.get('ecps'),
      waveformHash: Ember.RSVP.all(model.get('ecps').getEach('waveform')),
      quakeHash: model.get('quake'),
      originHash: model.get('quake').get('prefOrigin')
    });
  }
});
