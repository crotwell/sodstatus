import DS from 'ember-data';

export default DS.Model.extend({
  value: DS.attr('number'),
  magType: DS.attr('string'),
  contributor: DS.attr('string'),
  event: DS.belongsTo('event')
});
