import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class PerusalsQuakeOrStationLinkComponent extends Component {
  @tracked
  tagName = 'span';

  get isPrimaryByQuake() {
    return (this.primarySort == 'quake');
  }
  get isSameAsCurr() {
    if( ! this.quakeStation || ! this.current) {
      return false;
    }
    if (this.isPrimaryByQuake) {
      return this.quakeStation.get('quake').get('id') === this.current.get('quake').get('id');
    } else {
      return this.quakeStation.get('station').get('id') === this.current.get('station').get('id');
    }
  }
}
