import DS from 'ember-data';

export default DS.Model.extend({
    sodStatus: DS.attr('string'),
    quake: DS.belongsTo('quake', {async: true}),  
    channels: DS.hasMany('channel', {async: true}),
    waveform: DS.belongsTo('waveform', {async: true})
});
