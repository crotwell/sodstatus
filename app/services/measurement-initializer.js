import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class MeasurementInitializerService extends Service {
  @service store;
  checkNeedCreate(tools, quakeStation) {
    let out = false;
    tools.forEach(tool => {
      if( quakeStation.get('measurements').find( m => m.get('name') == tool.get('name')) == undefined) {
        this.createMeasurement(tool, quakeStation);
        out = true;
      }
    });
    return out;
  }

  createMeasurement(tool, quakeStation) {
    let measure = this.get('store').createRecord('measurementText', {
        name: tool.get('name'),
        value: null
    });
    quakeStation.get('measurements').pushObject(measure);
    measure.set('quakeStation', quakeStation);
    return measure;
  }
}
