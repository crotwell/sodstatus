import Model, { attr, belongsTo } from '@ember-data/model';

export default class ChannelModel extends Model {
    @attr('string') channelCode;
    @attr('string') locCode;
    @belongsTo('station', {async: true}) station;
    @attr('date') startTime;
    @attr('date') endTime;
    @attr('number') latitude;
    @attr('number') longitude;
    @attr('number') elevation;
    @attr('number') depth;
    @attr('number') sps;
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
      if (this.elevation) {
        return this.elevation.toFixed(2);
      } else {
        return "UNDEF";
      }
    }
    get depthFormatted() {
      if (this.depth) {
        return this.depth.toFixed(2);
      } else {
        return "UNDEF";
      }
    }
}
