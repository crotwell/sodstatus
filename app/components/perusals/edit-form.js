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
      if ( ! model.get('name')) {
        this.set("errorMessage", "name is required.");
        return true;
      }
      if ( ! model.get('username')) {
        this.set("errorMessage", "username is required.");
        return true;
      }
      return Ember.RSVP.all(model.get('tools').map(t => t.save()))
        .then((tools)=> {
          model.set('tools', tools);
          return model.save();
      }).then(model => {
              console.log("model saved"+model);
              return this.save(model);
            }, 
            err => this.set('errorMessage', 'problem saving the pursal: '+err));
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
       if ( ! this.get('model').get('tools').find(t => t.get('name') == toolName)) {
       let tool = this.get('store').createRecord('measurement-tool', {
         toolType: toolType,
         name: toolName,
         toolConfig: this.get('knownToolTypes').get(toolType.camelize()),
         perusal: this.get('model')
       });
       this.get('model').get('tools').pushObject(tool);
       } else {
         console.log("Tool already exists: "+toolName);
       }
    }
  }
});
