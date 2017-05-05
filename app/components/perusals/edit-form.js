import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  knownToolTypes: new Ember.Object({
    letterGrade: {toolType: 'letter-grade', display: 'Letter Grade'},
    somethingElse:  {toolType: 'something-else', display: 'Something Else'} }),
  toolType: 'letter-grade',
  actions: {
    save() {
      console.log('+- save action in edit-form component');
      console.log('   with '+this.get('model').get('tools').length);
      let model = this.get('model');
      return Ember.RSVP.all(model.get('tools').map(t => t.save()))
        .then((tools)=> {
console.log("done saving tools "+tools.length);
          model.set('tools', tools);
console.log("is dirty: "+model.get('hasDirtyAttributes'));
          return model.save();
      }).then(model => {
              console.log("model saved"+model);
              return this.save(model);
            }, 
            err => this.set('errorMessage', 'problem saving the pursal: '+err));

//      this.get('model').save().then((perusal) =>
//        {
//          perusal.get('tools').forEach(function(t) {
//console.log("save tool: "+t.get('name'));
//            t.save();
//          });
//          return perusal;
//        }).then((perusal) =>
//        {
//          return this.save(perusal);
//        }, (err) => {
//          this.set('errorMessage', 'problem saving the pursal: '+err);
//        });
    },
    cancel() {
      console.log('+- cancel action in edit-form component');
      this.get('model').destroyRecord();
      this.cancel();
    },
    changeEventSort(val) {
       this.get('model').set('eventSort', val);
    },
    changeStationSort(val) {
       this.get('model').set('stationSort', val);
    },
    changePrimarySort(val) {
       this.get('model').set('primarySort', val);
    },
    addTool(toolType, toolName) {
console.log("AddTool clicked "+toolType+" "+ toolName);
       let tool = this.get('store').createRecord('measurement-tool', {
         toolType: toolType,
         name: toolName,
         toolConfig: this.knownToolTypes.get(toolType),
         perusal: this.get('model')
       });
       this.get('model').get('tools').pushObject(tool);
    }
  }
});
