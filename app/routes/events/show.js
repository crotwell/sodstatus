import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var e = this.store.findRecord('event', params.event_id);
    return e;
  }
});
