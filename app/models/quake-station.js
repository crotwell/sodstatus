import DS from 'ember-data';

export default DS.Model.extend({
    sodStatus: DS.attr('string'),
    distdeg: DS.attr('number'),
    azimuth: DS.attr('number'),
    backazimuth: DS.attr('number'),
    quake: DS.belongsTo('quake', {async: true}),  
    station: DS.belongsTo('station', {async: true}),
    ecps: DS.hasMany('quakeVector', {async: true}),
    measurements: DS.hasMany('measurement', {async: true})
});
