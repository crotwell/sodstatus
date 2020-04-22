import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class QuakeModel extends Model {
  @attr('string') name;
  @attr('string') sodStatus;
  @attr('number') numSuccessfulStations;
  @belongsTo('magnitude') prefMagnitude;
  @belongsTo('origin') prefOrigin;
  @hasMany('quakeStation', {async: true}) quakeStationPairs;
}
