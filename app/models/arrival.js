import DS from 'ember-data';

export default DS.Model.extend({
  phasename: DS.attr('string'),
  puristname: DS.attr('string'),
  traveltime: DS.attr('number'),
  distdeg: DS.attr('number'),
  distrad: DS.attr('number'),
  sourcedepth: DS.attr('number'),
  incidentangle: DS.attr('number'),
  takeoffangle: DS.attr('number'),
  rayparamrad: DS.attr('number'),
  rayparamdeg: DS.attr('number'),
  model: DS.attr('string'),
});
