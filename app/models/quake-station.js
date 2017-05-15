import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
    sodStatus: DS.attr('string'),
    distdeg: DS.attr('number'),
    azimuth: DS.attr('number'),
    backazimuth: DS.attr('number'),
    quake: DS.belongsTo('quake', {async: true}),  
    station: DS.belongsTo('station', {async: true}),
    ecps: DS.hasMany('quakeVector', {async: true}),
    measurements: DS.hasMany('measurement', {async: true, defaultValue: Ember.A([]) }),

    measurementForName(name) {
console.log("quake-station model measurementsForName");
      return this.get('measurements').then(meas => {
      console.log("measurementForName("+name+"  "+meas.length);
      return meas.find( m => m.get('name') == name);
      });
    },
    putMeasurement(inMeas) {
      this.get('measurements').then(meas => {
        let idx = meas.findIndex(m => m.get('name') == inMeas.get('name'));
        if (idx == -1) meas.push(inMeas);
        else meas[idx] = inMeas;
      });
    }
});
