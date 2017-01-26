import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  quake: DS.belongsTo('quake', {
    inverse: 'prefOrigin'}) ,
  time: DS.attr('date'),
  latitude: DS.attr('number'),
  longitude: DS.attr('number'),
  depth: DS.attr('number'),
  elevation: DS.attr('number'),
  catalog: DS.attr('string'),
  contributor: DS.attr('string'),
  magnitudes: DS.hasMany('magnitude'),
  latitudeFormatted: Ember.computed('latitude', function() {
     return this.get('latitude').toFixed(2);
  }),
  longitudeFormatted: Ember.computed('latitude', function() {
     return this.get('longitude').toFixed(2);
  }),
  depthFormatted: Ember.computed('depth', function() {
     return this.get('depth').toFixed(2);
  })
});
