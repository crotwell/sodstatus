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
       return this.latitude.toFixed(2);
    }
    get longitudeFormatted() {
       return this.longitude.toFixed(2);
    }
    get elevationFormatted() {
       return this.elevation.toFixed(2);
    }
    get depthFormatted() {
       return this.depth.toFixed(2);
    }
}
