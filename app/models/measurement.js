import Model, {attr, belongsTo } from '@ember-data/model';

export default class MeasurementModel extends Model {
    @attr('string') name;
    @belongsTo('quake-station') quakeStation;
    @belongsTo('perusal') perusal;
    @attr() value;
}
