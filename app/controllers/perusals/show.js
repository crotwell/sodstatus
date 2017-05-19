import Ember from 'ember';

const allDestinations = ['first', 'prev', 'next'];

export default Ember.Controller.extend({
  measurementInit: Ember.inject.service('measurement-initializer'),
  phases: 'firstP,firstS',
  
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
                return Ember.RSVP.all(madeMeasurements.map(m => m.save()));
              } else {
                curr.set('measurements', [ ]);
                return curr.get('measurements');
              }
            })
            .then(() => console.log("measurements saved"))
            .then(() => curr.save());
         });
  },
  moveTo(destination) {
      if ( ! allDestinations.find(a => a === destination)) {
        throw new Error("destination must be one of "+allDestinations.join()+" but was "+destination);
      }
      console.log("perusal moveTo "+destination);
      let that = this;
      let model = this.get('model');
      let measurementInit = this.get('measurementInit');
      return new Ember.RSVP.Promise(function(resolve, reject) {
          resolve( that.doSaveCurr());
        })
        .then(() => this.get('store').unloadAll('waveform'))
        .then(() => model.hashQuakeStation(model.get(destination)))
        .then(function() {
          if (measurementInit.checkNeedCreate(model.get('tools'), model.get(destination))) {
            console.log(destination+": perusal: created measurements "+model.get(destination).get('measurements').length);
          }
        })
        .then(function() {
          console.log("perusal go to "+destination);
          let c = model.get('curr');
          if (c.hasDirtyAttributes) {
            c.save();
          }
          if (destination == 'next') {
            return model.goToNext();
          } else if (destination == 'prev') {
            return model.goToPrev();
          } else if (destination == 'first') {
            return model.goToFirst();
          }
        }).then(m => {
            return model.save();
        }).catch(err => {
            console.log("Caught error in "+destination+" action");
            console.log(err);
        });
  },
  actions: {
    delete: function() {
      let model = this.get('model');
      model.beginPropertyChanges();
      let toolList = model.get('tools');
      toolList.forEach(t => {t.deleteRecord();t.save()});
      model.deleteRecord();
      model.save();
      return this.transitionToRoute('perusals')
        .then(function() {model.endPropertyChanges();});
    },
    first: function() {
      console.log("perusal first");
      return this.moveTo('first');
    },
    prev: function() {
      console.log("perusal prev");
      return this.moveTo('prev');
    },
    save: function() {
      return this.doSaveCurr();
    },
    next: function() {
      console.log("perusal next");
      return this.moveTo('next');
    }
  }
});
