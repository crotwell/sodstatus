import Ember from 'ember';

export default Ember.Component.extend({
  newestFirst: function() {
    return this.get('quakes').toArray().reverse();
  }.property('quakes')
});
