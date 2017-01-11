import Ember from 'ember';

export default Ember.Component.extend({
  newestFirst: function() {
    return this.get('esps').toArray().reverse();
  }.property('esps')
});
