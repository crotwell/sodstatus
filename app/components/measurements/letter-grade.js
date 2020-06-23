import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from "@glimmer/tracking";

const UNGRADED = 'ungraded';

export default class MeasurementsLetterGradeComponent extends Component {
  @service store;
  gradeList = ['A', 'B', 'F', UNGRADED];
  @tracked
  measurement = null;
  didRender() {
    // check measuement object created for this tool
      const tool = this.args.tool;
      const curr = this.args.curr;
      let measurements = curr.get('measurements');
      let m = measurements.find( m => m.get('name') === tool.get('name'));
      if (typeof m === 'undefined') {
        throw new Error("Measurement for tool: "+tool.get('name')+" is undefined.");
      } else {
        this.measurement = m;
      }
  }
  get currMeasurement() {
    const tool = this.args.tool;
    const curr = this.args.curr;
    let measurements = curr.get('measurements');
    if ( ! measurements) {
      return null;
    }
    let m = measurements.find( m => m.get('name') == tool.get('name'));
    return m;
  }
  @action
    changeLetterGrade(val) {
      let meas = this.args.measurement;
      //let meas = this.get('measurement');
      if ( ! meas ) {
        const tool = this.args.tool;
        const curr = this.args.curr;
        const perusal = this.args.perusal;
        const record = this.store.createRecord('measurement', {
          name: tool.name,
          quakeStation: curr,
          perusal: perusal,
          value: val
        });
        record.save();
        curr.get('measurements').pushObject(record);
      }
    }

}
