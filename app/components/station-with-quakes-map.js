import Ember from 'ember';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
//    this.quakes = [];
  },
  didUpdateAttrs() {
    this._super(...arguments);
//    this.set('quakes', this.get('station').get('quakes'));
  },

/*
  quakes: function() {
    let s = this.get('station');
    if (s) {
      return this.get('station').get('quakes');
    } else {
      return [];
    }
  }.property('station');
*/
});
