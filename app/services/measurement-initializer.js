import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class MeasurementInitializerService extends Service {
  @service store;
  checkNeedCreate(tools, quakeStation) {
    console.log(`MeasurementInitializerService.checkNeedCreate qs=${quakeStation}`);
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
    if ( ! quakeStation) {console.log("Warn: quakeStation is null in createMeasurement(tool, quakeStation)")}
    let measure = this.get('store').createRecord('measurement', {
        name: tool.get('name'),
        value: null
    });
    quakeStation.get('measurements').pushObject(measure);
    measure.set('quakeStation', quakeStation);
    return measure;
  }
}
