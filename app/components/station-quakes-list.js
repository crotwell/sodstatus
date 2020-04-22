import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { sort } from '@ember/object/computed';

export default class StationQuakesListComponent extends Component {

  @tracked sortDefinition = ['quake.prefOrigin.time'];

  get sortedQuakes() {
    let out = sort('quakeStationPairs', 'sortDefinition');
    console.log(`in get sortedQuakes ${out.length}`);
    console.log(out[0])
    //return out;
    return this.args.quakeStationPairs;
  }

  @action sortBy(key) {
    let direction = "asc";
    if (this.get('sortDefinition')[0].startsWith(key)) {
      if (this.get('sortDefinition')[0].endsWith(":desc")) {
        direction = "asc";
      } else {
        direction = "desc";
      }
    } else {
      direction = "asc";
    }
    this.set("sortDefinition", [ key+":"+direction ]);
  }
}
