import DS from 'ember-data';

export default DS.Model.extend({
    sodStatus: DS.attr('string'),
    event: DS.belongsTo('event', {async: true}),  
    station: DS.belongsTo('station', {async: true}),
    ecps: DS.hasMany('event-vector', {async: true})
});
