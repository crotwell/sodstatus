import Model, {attr} from '@ember-data/model';

export default class ArmModel extends Model {
  @attr('string') name;
  @attr('boolean') isActive;
}
