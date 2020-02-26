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
}
