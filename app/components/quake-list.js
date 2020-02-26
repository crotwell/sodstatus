import Component from '@glimmer/component';

export default class QuakeListComponent extends Component {
  get sortedQuakes() {
    return this.quakes;
  }
}
