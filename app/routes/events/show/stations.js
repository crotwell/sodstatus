import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var e = this.modelFor('events.show');
    var s = e.get('esps');
    return s;
  }
});
