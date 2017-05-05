import DS from 'ember-data';

export default DS.Model.extend({
  toolType: DS.attr('string'),
  name: DS.attr('string'),
  toolConfig: DS.attr(),
  perusal: DS.belongsTo('perusal')
});
