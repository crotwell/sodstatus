import Model, { attr } from '@ember-data/model';

export default class MagnitudeModel extends Model {
  @attr('number') value;
  @attr('string') magType;
  @attr('string') contributor
  get magFormatted() {
    return this.get('value').toFixed(2);
  }
}
