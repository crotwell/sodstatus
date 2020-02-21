import Model, { attr } from '@ember-data/model';

export default class SodConfigModel extends Model {
  @attr('date') timestamp;
  @attr('string') config;
}
