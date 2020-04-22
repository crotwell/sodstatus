import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class StationModel extends Model {
  @attr('string') stationCode;
  @attr('date') startTime;
  @attr('date') endTime;
  @attr site;
  @belongsTo('network', {async: true}) network;
  @hasMany('channel', {async: true}) channels;
  @hasMany('quakeStation', {async: true}) quakeStationPairs;
  @attr('number') latitude;
  @attr('number') longitude;
  @attr('number') elevation;
  get latitudeFormatted() {
    if (this.latitude) {
      return this.latitude.toFixed(2);
    } else {
      return "UNDEF";
    }
  }
  get longitudeFormatted() {
    if (this.longitude) {
      return this.longitude.toFixed(2);
    } else {
      return "UNDEF";
    }
  }
  get elevationFormatted() {
    if (this.longitude) {
      return this.elevation.toFixed(2);
    } else {
      return "UNDEF";
    }
  }
  get codes() {
    let nc = "UNDEF";
    let sc = "UNDEF";
    if (this.network) {
      nc = this.network.get('networkCode');
    }
    if (this.stationCode) {
      sc = this.stationCode;
    }
    return nc+"."+sc;
  }
}
