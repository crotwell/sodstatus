import Model, { attr, hasMany } from '@ember-data/model';

export default class NetworkModel extends Model {
  @attr networkCode;
  @attr('date') startTime;
  @attr('date') endTime;
  @attr description;
  @hasMany('station', {async: true}) stations;
}
