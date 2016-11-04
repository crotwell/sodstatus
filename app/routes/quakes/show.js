import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var e = this.store.findRecord('quake', params.quake_id);
    return e;
  }
});
