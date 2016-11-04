import DS from 'ember-data';

export default DS.Model.extend({
    sodStatus: DS.attr('string'),
    quake: DS.belongsTo('quake', {async: true}),  
    station: DS.belongsTo('station', {async: true}),
    ecps: DS.hasMany('quakeVector', {async: true})
});
