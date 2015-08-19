import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var esp = this.store.findRecord('eventStation', params.esp_id);
    return esp;
  }
});
