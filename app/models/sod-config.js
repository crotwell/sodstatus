import DS from 'ember-data';

export default DS.Model.extend({
  timestamp: DS.attr('date'),
  config: DS.attr('string')
});
