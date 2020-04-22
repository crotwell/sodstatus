import Model, { attr, belongsTo } from '@ember-data/model';

export default class QuakeStationModel extends Model {
    @attr('string') sodStatus;
    @attr('number') distdeg;
    @attr('number') azimuth;
    @attr('number') backazimuth;
    @belongsTo('quake') quake;
    @belongsTo('station') station;
}
