import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  isPrimaryByQuake: Ember.computed('primarySort', function() {
    return (this.get('primarySort') == 'quake');
  }),
  isSameAsCurr: Ember.computed('quakeStation', 'current', 'isPrimaryByQuake', function() {
    if( ! this.get('quakeStation') || ! this.get('current')) {
      return false;
    }
    if (this.get('isPrimaryByQuake')) {
      return this.get('quakeStation').get('quake').get('id') === this.get('current').get('quake').get('id');
    } else {
      return this.get('quakeStation').get('station').get('id') === this.get('current').get('station').get('id');
    }
  })

});
