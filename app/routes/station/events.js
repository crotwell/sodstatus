import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var s = this.modelFor('station');
    var e = s.get('esps');
    return e;
  }
});
