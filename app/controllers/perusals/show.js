import Ember from 'ember';

export default Ember.Controller.extend({

  doSave() {
      let model = this.get('model');
console.log("perusal save");
console.log("found measurements "+model.get('curr').get('measurements').length);
console.log("      measurements "+model.get('curr').get('measurements')[0]);
      
      return model.get('curr')
        .then(curr => {
          curr.get('measurements')
            .then(measurements => {
              if (measurements) {
                measurements = measurements.filter(m => m.get('name'))
                                           .filter(m => m.get('value'));
                curr.set('measurements', measurements);
                Ember.RSVP.all(measurements.map(m => m.save()));
                return measurements;
              } else {
                curr.set('measurements', [ ]);
                return curr.get('measurements');
              }
            })
            .then(measurements => console.log("measurements saved"))
            .then(v => model.save());
         });
  },
  actions: {
    delete: function() {
      let model = this.get('model');
      model.beginPropertyChanges();
      model.deleteRecord();
      model.get('tools').map(t => {t.deleteRecord();t.save()});
      model.save();
      model.endPropertyChanges();
      return this.transitionToRoute('perusals');
    },
    prev: function() {
      let model = this.get('model');
      return model.save().then(v => { console.log("prev Save thened "+v);});
    },
    save: function() {
      return this.doSave();
    },
    next: function() {
console.log("perusal next");
      let that = this;
      let model = this.get('model');
      return this.doSave()
.then(function() {console.log("doSave finished");})
        .then(function() {
console.log("perusal go to next ");
          let p = model.get('prev');
          let c = model.get('curr');
          let n = model.get('next');
          if (c.hasDirtyAttributes) {
            c.save();
          } else {
            console.log("curr not dirty");
          }
          model.setProperties({'prev': c, 'curr': n, 'next': null});
          return model.save();
        }).then(m => {
            console.log("next Save thened ");
            return that.transitionToRoute('perusals.show', model);
        }).catch(err => console.log(err));
    }
  }
});
