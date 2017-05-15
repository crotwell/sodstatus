import Ember from 'ember';

export default Ember.Controller.extend({
  measurementInit: Ember.inject.service('measurement-initializer'),
  
  doSaveCurr() {
      let model = this.get('model');
      console.log("perusal save curr:"+model.get('curr').get('id'));
      model.get('curr').get('measurements').forEach(m => console.log("doSaveCurr: measurements "+m.get('name')+": "+m.get('value')));
      
      return model.get('curr')
        .then(curr => {
          curr.get('measurements')
            .then(measurements => {
              if (measurements) {
                // don't save measurements without name or value
                let madeMeasurements = measurements.filter(m => m.get('name'))
                                           .filter(m => m.get('value'));
                madeMeasurements.forEach(m => console.log("attempt save: measurements "+m.get('name')));
                Ember.RSVP.all(madeMeasurements.map(m => m.save()));
                return measurements;
              } else {
                curr.set('measurements', [ ]);
                return curr.get('measurements');
              }
            })
            .then(measurements => console.log("measurements saved"))
            .then(v => curr.save());
         });
  },
  actions: {
    delete: function() {
      let model = this.get('model');
      model.beginPropertyChanges();
      model.get('tools').map(t => {t.deleteRecord();t.save()});
      model.deleteRecord();
      model.endPropertyChanges();
      model.save();
      return this.transitionToRoute('perusals');
    },
    first: function() {
      console.log("perusal first");
      let that = this;
      let model = this.get('model');
      let measurementInit = this.get('measurementInit');
      Ember.beginPropertyChanges();
      return this.doSaveCurr()
        .then(function() {
          if (measurementInit.checkNeedCreate(model.get('tools'), model.get('first'))) {
            console.log("next: perusal: created measurements "+model.get('first').get('measurements').length);
          }
        })
        .then(function() {
          console.log("perusal go to first ");
          let c = model.get('curr');
          if (c.hasDirtyAttributes) {
            c.save();
          }
          model.goToFirst();
          return model;
        }).then(m => {
            model.save();
            Ember.endPropertyChanges();
            return that.transitionToRoute('perusals.show', model);
        }).catch(err => console.log(err));
    },
    prev: function() {
      console.log("perusal prev");
      let that = this;
      let model = this.get('model');
      let measurementInit = this.get('measurementInit');
      Ember.beginPropertyChanges();
      return this.doSaveCurr()
        .then(function() {
          if (measurementInit.checkNeedCreate(model.get('tools'), model.get('prev'))) {
            console.log("next: perusal: created measurements "+model.get('prev').get('measurements').length);
          }
        })
        .then(function() {
          console.log("perusal go to prev ");
          let c = model.get('curr');
          if (c.hasDirtyAttributes) {
            c.save();
          }
          model.goToPrev();
          return model;
        }).then(m => {
            model.save();
            Ember.endPropertyChanges();
            return that.transitionToRoute('perusals.show', model);
        }).catch(err => console.log(err));
    },
    save: function() {
      return this.doSaveCurr();
    },
    next: function() {
      console.log("perusal next");
      let that = this;
      let model = this.get('model');
      let measurementInit = this.get('measurementInit');
      Ember.beginPropertyChanges();
      return this.doSaveCurr()
        .then(function() {
          if (measurementInit.checkNeedCreate(model.get('tools'), model.get('next'))) {
            console.log("next: perusal: created measurements "+model.get('next').get('measurements').length);
          }
        })
        .then(function() {
          console.log("perusal go to next ");
          let c = model.get('curr');
          if (c.hasDirtyAttributes) {
            c.save();
          }
          model.goToNext();
          return model; 
        }).then(m => {
            model.save();
            Ember.endPropertyChanges();
            return that.transitionToRoute('perusals.show', model);
        }).catch(err => console.log(err));
    }
  }
});
