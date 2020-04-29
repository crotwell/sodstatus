import Model, {attr, belongsTo } from '@ember-data/model';

export default class MeasurementToolModel extends Model {
  @attr('string') toolType;
  @attr('string') name;
  @attr() toolConfig;
  @belongsTo('perusal') perusal;
}
