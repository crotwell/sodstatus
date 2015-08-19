import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var s = this.store.findRecord('station', params.station_id);
    return s;
  }
});
