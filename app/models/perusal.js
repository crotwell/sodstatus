import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  username: DS.attr('string'),
  primarySort: DS.attr('string'),
  eventSort: DS.attr('string'),
  stationSort: DS.attr('string'),
  first: DS.belongsTo('quakeStation'),
  prev: DS.belongsTo('quakeStation'),
  curr: DS.belongsTo('quakeStation'),
  next: DS.belongsTo('quakeStation'),
  tools: DS.hasMany('measurementTool'),
  goToFirst() {
    return this.setProperties({'prev': null, 'curr': this.get('first'), 'next': null});
  },
  goToPrev() {
    return this.get('prev')
      .then(p => {
        let c = this.get('curr');
        this.setProperties({'prev': null, 'curr': p, 'next': c});
      });
  },
  goToNext() {
    return this.get('next')
      .then(n => {
        let c = this.get('curr');
        this.setProperties({'prev': c, 'curr': n, 'next': null});
      });
  }
});
