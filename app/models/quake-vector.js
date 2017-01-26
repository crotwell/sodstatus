import DS from 'ember-data';

export default DS.Model.extend({
    sodStatus: DS.attr('string'),
    cookieJar: DS.attr('rawjson'),
    quake: DS.belongsTo('quake', {async: true}),  
    channels: DS.hasMany('channel', {async: true}),
    waveform: DS.belongsTo('waveform', {async: true})
});
