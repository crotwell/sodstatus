import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  ungraded: 'ungraded',
  gradeList: ['A', 'B', 'F', this.ungraded],
  measurement: Ember.computed('tool', 'perusal.curr', function() {
      let tool = this.get('tool');
      let perusal = this.get('perusal');
console.log("measurement return promise");
      return DS.PromiseObject.create({
        promise: perusal.get('curr')
          .then( curr => curr.get('measurements'))
          .then( measurements => {
            let m = measurements.find( m => m.get('name') == tool.get('name'));
            if (typeof m == 'undefined') {
    console.log(" measure undef so create");
              let measure = this.get('store').createRecord('measurementText', {name: tool.get('name'), value: this.ungraded});
              let curr = perusal.get('curr');
              curr.get('measurements').then( allMeas => {
                allMeas.pushObject(measure);
                measure.set('quakeStation', curr);
              });
              return measure;
            }
            console.log("measurement find return "+m);
            return m;
          })
      });
  }),
  grade: Ember.computed('tool', 'perusal.curr', 'measurement', {
    get(){
 console.log("grade get");
      return DS.PromiseObject.create({
        promise: this.get('measurement').then(m => {
            if (m) return m.get('value');
             console.log("grade get return undefined");
            return this.ungraded;
        })
      });
    },
    set(key, value) {
      let tool = this.get('tool');
      let perusal = this.get('perusal');
      console.log("Grade set "+tool.get('name')+" "+key+" = "+value);
      this.get('measurement').then(m => m.set('value', value));
    }
  }),
  actions: {
    changeLetterGrade(val) {
console.log("changeLetterGrade: "+val);
      let tool = this.get('tool');
      let perusal = this.get('perusal');
      this.set('grade', val)
    }
  }
});
