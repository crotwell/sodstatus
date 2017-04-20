import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  username: DS.attr('string'),
  primarySort: DS.attr('string'),
  eventSort: DS.attr('string'),
  stationSort: DS.attr('string'),
  prev: DS.belongsTo('quakeStation'),
  curr: DS.belongsTo('quakeStation'),
  next: DS.belongsTo('quakeStation')
});
