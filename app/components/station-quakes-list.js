import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { sort } from '@ember/object/computed';

export default class StationQuakesListComponent extends Component {

  @tracked sortDefinition = ['quake.prefOrigin.time'];

  @sort('args.quakeStationPairs', 'sortDefinition') sortedQuakes;

  @action sortBy(key) {
    console.log(`sortBy(${key})  `);
    let direction = "asc";
    if (this.sortDefinition[0].startsWith(key)) {
      if (this.sortDefinition[0].endsWith(":desc")) {
        direction = "asc";
      } else {
        direction = "desc";
      }
    } else {
      direction = "asc";
    }
    this.sortDefinition = [ key+":"+direction ];
  }
}
