import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  numSuccessfulStations: DS.attr('number'),
  prefOrigin: DS.belongsTo('origin', { async: true }),
  prefMagnitude: DS.belongsTo('magnitude', { async: false }),
  sodStatus: DS.attr('string'),
  esps: DS.hasMany('quakeStation', {async: true}),
  stations: Ember.computed('esps', function() {
    return this.get('esps').getEach('station');
  }),
});
