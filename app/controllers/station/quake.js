import Ember from 'ember';

export default Ember.Controller.extend({

  queryParams: [ 'phases' ],
  phases: "",
  phaseToAdd: "",
  actions: {
    addPhases: function(p) {
      if (p && p.length > 0 ) {
        let temp = this.get('phases');
        if (temp.length > 0) { temp = temp + ",";}
        this.set('phases', temp+p);
      }
      this.set('phaseToAdd', "");
    },
    updatePhases: function(p) {
      this.set('phases', p);
      this.transitionToRoute({ queryParams: { phases: p }});
    }
  }
});
