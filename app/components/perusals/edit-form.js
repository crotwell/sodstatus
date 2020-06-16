import Component from '@glimmer/component';
import RSVP from 'rsvp';
import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class PerusalsEditFormComponent extends Component {
  @service store;

  knownToolTypes = EmberObject.create({
    letterGrade: {toolType: 'letter-grade', display: 'Letter Grade'},
    somethingElse:  {toolType: 'something-else', display: 'Something Else'} });

  @tracked
  toolType = 'letter-grade';
  @tracked
  errorMessage = "";
  @action
  save() {
    console.log('+- save action in edit-form component');
    let model = this.args.perusal;
    console.log(`model/perusal is ${model}`);
    console.log('   with '+this.args.perusal.get('tools').length);
    if ( ! model.get('name')) {
      this.set("errorMessage", "name is required.");
      return true;
    }
    if ( ! model.get('username')) {
      this.set("errorMessage", "username is required.");
      return true;
    }
    /*
    return model.save();
     */
    return RSVP.all(model.get('tools').map(t => t.save()))
      .then((tools)=> {
        //model.set('tools', tools);
        return model.save();
    }).then(model => {
            console.log("model saved"+model);
            //return this.save(model);
            return model;
          },
          err => {this.errorMessage = 'problem saving the pursal: '+err});

  }
  @action
  cancel() {
    console.log('+- cancel action in edit-form component');
    if (this.args.perusal.id) {
      this.args.perusal.destroyRecord();
    }
    //this.cancel();
  }
  @action
  changeEventSort(val) {
     this.args.perusal.set('eventSort', val);
  }
  @action
  changeStationSort(val) {
     this.args.perusal.set('stationSort', val);
  }
  @action
  changePrimarySort(val) {
     this.args.perusal.set('primarySort', val);
  }
  @action
  addTool(toolType, toolName) {
     if ( ! this.args.perusal.get('tools').find(t => t.get('name') == toolName)) {
     let tool = this.store.createRecord('measurement-tool', {
       toolType: toolType,
       name: toolName,
       toolConfig: this.knownToolTypes.get(toolType.camelize()),
       perusal: this.args.perusal
     });
     this.args.perusal.get('tools').pushObject(tool);
     } else {
       console.log("Tool already exists: "+toolName);
     }
  }
}
