import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  prefOrigin: DS.belongsTo('origin', { async: true }),
  prefMagnitude: DS.belongsTo('magnitude', { async: true }),
  sodStatus: DS.attr('string')
});
