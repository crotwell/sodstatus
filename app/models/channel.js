import DS from 'ember-data';

export default DS.Model.extend({
  channelCode: DS.attr('string'),
  siteCode: DS.attr('string'),  
  station: DS.belongsTo('station', {async: true}),
  startTime: DS.attr('date'),
  endTime: DS.attr('date'),
  latitude: DS.attr('number'),
  longitude: DS.attr('number'),
  elevation: DS.attr('number'),
  depth: DS.attr('number'),
  sps: DS.attr('number')
});
