import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save(model) {
      console.log('+--- save action called in friends new controller');
      return this.transitionToRoute('perusals.show', model);
    },
    cancel() {
      console.log('+--- cancel action called in friends new controller');
      return this.transitionToRoute('perusals');
    }
  }

});
