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
      let m = measurements.find( m => m.get('name') == tool.get('name'));
      if (typeof m == 'undefined') {
        //throw new Error("Measurement for tool: "+tool.get('name')+" is undefined.");
        console.log(`did not find measurment for tool ${tool.name}`);
      } else {
        this.measurement = m;
      }
  }
  get currMeasurement() {
    const tool = this.args.tool;
    const curr = this.args.curr;
    let measurements = curr.get('measurements');
    //let measurements = curr.measurements;
    if ( ! measurements) {
      console.log('curr measurements is undef, return []');
      return null;
    }
    console.log(`measurements: ${curr} ${measurements.length}`)
    let m = measurements.find( m => m.get('name') == tool.get('name'));
    if (typeof m == 'undefined') {
      console.log("Measurement for tool: "+tool.get('name')+" is undefined.");
    }
    return m;
  }
  @action
    changeLetterGrade(val) {
      console.log("changeLetterGrade: "+val);
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
        console.log(`saved measurement: ${record}`);
      }
    }

}
