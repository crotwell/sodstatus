import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class QuakeVectorModel extends Model {
    @attr('string') sodStatus;
    @attr('number') distdeg;
    @attr('number') azimuth;
    @attr('number') backazimuth;
    @belongsTo('quake') quake;
    @hasMany('channel') channels;
    @attr() measurements;
    @hasMany('waveform') waveforms;

}
