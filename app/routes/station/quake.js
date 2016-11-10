import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var esp = this.store.findRecord('quakeStation', params.esp_id);
    return esp;
  },
  afterModel: function(model, transition) {
    return Ember.RSVP.all([
      model.station,
      model.get('quake'),
      model.get('quake').get('prefOrigin')
    ]);
  }
});
