import Model, { attr, belongsTo } from '@ember-data/model';

export default class OriginModel extends Model {
  @belongsTo('quake', {inverse: 'prefOrigin'}) quake;
  @attr('date') time;
  @attr('number') latitude;
  @attr('number') longitude;
  @attr('number') depth;
  @attr('number') elevation;
  @attr('string') catalog;
  @attr('string') contributor;
  get latitudeFormatted() {
     return this.latitude.toFixed(2);
  }
  get longitudeFormatted() {
     return this.longitude.toFixed(2);
  }
  get depthFormatted() {
     return this.depth.toFixed(2);
  }
}
