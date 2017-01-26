import Ember from 'ember';

export default Ember.Component.extend({
  sortedQuakes: Ember.computed.sort('quakes', 'sortDefinition'),
  sortDefinition: ['prefOrigin.time'],
  newestFirst: function() {
    return this.get('quakes').toArray().reverse();
  }.property('quakes'),
  actions: {
    sortBy: function(prop) {
      let direction = "asc";
      if (this.get('sortDefinition')[0].startsWith(prop)) {
        if (this.get('sortDefinition')[0].endsWith(":desc")) {
          direction = "asc";
        } else {
          direction = "desc";
        }
      } else {
        direction = "asc";
      }
      this.set("sortDefinition", [ prop+":"+direction ]);
    }
  }
});
