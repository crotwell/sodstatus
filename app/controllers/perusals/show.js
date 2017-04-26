import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    delete: function() {
      let model = this.get('model');
      model.destroyRecord();
      this.transitionToRoute('perusals');
    },
    prev: function() {
      let model = this.get('model');
      model.set('next', model.get('curr'));
      model.set('curr', model.get('prev'));
      model.set('prev', null);
      model.save();
    },
    next: function() {
      let model = this.get('model');
      model.set('prev', model.get('curr'));
      model.set('curr', model.get('next'));
      model.set('next', null);
      model.save();
    }
  }
});
