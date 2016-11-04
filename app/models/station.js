import DS from 'ember-data';


export default DS.Model.extend({
  stationCode: DS.attr('string'),
  network: DS.belongsTo('network', {async: true}),
  channels: DS.hasMany('channel', {async: true}),
  name: DS.attr('string'),
  description: DS.attr('string'),
  startTime: DS.attr('date'),
  endTime: DS.attr('date'),
  latitude: DS.attr('number'),
  longitude: DS.attr('number'),
  elevation: DS.attr('number'),
  esps: DS.hasMany('quakeStation', {async: true}),
  latitudeFormatted:  function() {
     return this.get('latitude').toFixed(2);
  }.property('latitude'),
  longitudeFormatted:  function() {
     return this.get('longitude').toFixed(2);
  }.property('longitude'),
  codes: function() {
    return this.get('network').get('networkCode')+"."+this.get('stationCode');
  }.property('stationCode', 'network.networkCode'),
  quakes: function() {
/*
    let espsList = this.get('esps');
    return espsList.mapBy('quake');
*/
    return DS.PromiseArray.create({
      promise: this.get('esps').then(espsList => {
        return espsList.mapBy('quake');
      })
    });
  }.property('esps.@each.quake'),

  originList: function() {
    return this.get('quakes').getEach('prefOrigin');
  }.property('quakes'),
});
