import Ember from 'ember';

export default Ember.Component.extend({
  sortedQuakes: Ember.computed.sort('esps', 'sortDefinition'),
  sortDefinition: ['quake.prefOrigin.time'],
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
