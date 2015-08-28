import DS from 'ember-data';

export default DS.Model.extend({
    sodStatus: DS.attr('string'),
    event: DS.belongsTo('event', {async: true}),  
    channels: DS.hasMany('channel', {async: true}),
    waveform: DS.belongsTo('waveform', {async: true})
});
