import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var n = this.store.findRecord('network', params.network_id);
    return n;
  }
});
