import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  value: DS.attr('number'),
  magType: DS.attr('string'),
  contributor: DS.attr('string'),
  quake: DS.belongsTo('quake'),
  magFormatted: Ember.computed('value', function() {
     return this.get('value').toFixed(2);
  }),
});
