import Ember from 'ember';
import DS from 'ember-data';

const UNGRADED = 'ungraded';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  gradeList: ['A', 'B', 'F', UNGRADED],
  didRender() {
    // check measuement object created for this tool
      let tool = this.get('tool');
      let curr = this.get('curr');
      let measurements = curr.get('measurements');
      let m = measurements.find( m => m.get('name') == tool.get('name'));
      if (typeof m == 'undefined') {
        throw new Error("Measurement for tool: "+tool.get('name')+" is undefined.");
      }
      this.set('measurement', m);
  },
  actions: {
    changeLetterGrade(val) {
      console.log("changeLetterGrade: "+val);
      this.get('measurement').set('value', val);
    }
  }
});
