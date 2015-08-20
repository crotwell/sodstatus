import DS from 'ember-data';
import Ember from 'ember';


export default DS.Model.extend({
  stationCode: DS.attr('string'),
  network: DS.belongsTo('network', {async: true}),
  channels: DS.hasMany('channel', {async: true}),
  name: DS.attr('string'),
  description: DS.attr('string'),
  startTime: DS.attr('date'),
  endTime: DS.attr('date'),
  latitude: DS.attr('number'),
  longitude: DS.attr('number'),
  elevation: DS.attr('number'),
  esps: DS.hasMany('eventStation', {async: true}),
  latitudeFormatted: Ember.computed('latitude', function() {
     return this.get('latitude').toFixed(2);
  }),
  longitudeFormatted: Ember.computed('latitude', function() {
     return this.get('longitude').toFixed(2);
  })
});
