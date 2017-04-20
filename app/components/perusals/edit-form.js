import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    save() {
      console.log('+- save action in edit-form component');
      this.get('model').save().then((perusal) =>
        {
          return this.save(perusal);
        }, (err) => {
          this.set('errorMessage', 'problem saving the pursal: '+err);
        });
    },
    cancel() {
      console.log('+- cancel action in edit-form component');
      this.cancel();
    }
  }
});
