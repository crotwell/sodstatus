import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    save(model) {
      return this.transitionToRoute('perusals.show', model);
    },
    cancel() {
      return this.transitionToRoute('perusals');
    }
  }

});
