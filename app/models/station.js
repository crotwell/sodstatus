import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class StationModel extends Model {
  @attr('string') stationCode;
  @attr('date') startTime;
  @attr('date') endTime;
  @attr site;
  @belongsTo('network', {async: true}) network;
  @hasMany('channel', {async: true}) channels;
  @attr('number') latitude;
  @attr('number') longitude;
  @attr('number') elevation;
  get latitudeFormatted() {
     return this.latitude.toFixed(2);
  }
  get longitudeFormatted() {
     return this.longitude.toFixed(2);
  }
  get elevationFormatted() {
     return this.elevation.toFixed(2);
  }
}
