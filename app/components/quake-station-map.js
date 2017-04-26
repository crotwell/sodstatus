import Ember from 'ember';

export default Ember.Component.extend({
  magToPixelScale: 3,
  quakeList: function() {
    let quakes = this.get('quakes');
    if (quakes) {
      if ( ! Ember.isArray(quakes)) {
        return [ quakes ];
      } else {
        return quakes;
      }
    } else {
      return [];
    }
  }.property('quakes'),
  plotQuakeList: function() {
    return this.get('quakeList').map(function(q) {
      return {
        latitude: q.get('prefOrigin').get('latitude'),
        longitude: q.get('prefOrigin').get('longitude'),
        scaledMag: (q.get('prefMagnitude').get('value')*this.get('magToPixelScale')),
        quake: q
      };
    }, this);
  }.property('quakeList.@each.prefOrigin', 'quakeList.@each.prefMagnitude'),

  originList: function() {
    return this.get('quakeList').getEach('prefOrigin');
  }.property('quakeList.@each.prefOrigin'),

  stationList: function() {
    let stations = this.get('stations');
    if (stations) {
      if ( ! Ember.isArray(stations)) {
        return [ stations ];
      } else {
        return stations;
      }
    } else {
      return [];
    }
  }.property('stations'),

  bounds: function() {
    let quakeList = this.get('quakeList');
    let originList = this.get('originList');
    let stationList = this.get('stationList');
    let minLat=99;
    let maxLat=-99;
    let minLon=200;
    let maxLon=-200;
    let minLatFn = function(a,b) {
      if (! b || a < b.get('latitude')) { return a; } else { return b.get('latitude'); }
    };
    minLat = originList.reduce(minLatFn , minLat); 
    minLat = stationList.reduce(minLatFn, minLat);

    let maxLatFn = function(a,b) {
      if (! b || a > b.get('latitude')) { return a; } else { return b.get('latitude'); }
    };
    maxLat = originList.reduce(maxLatFn , maxLat); 
    maxLat = stationList.reduce(maxLatFn, maxLat);
     
    let minLonFn = function(a,b) {
      if (! b || a < b.get('longitude')) { return a; } else { return b.get('longitude'); }
    };
    minLon = originList.reduce(minLonFn , minLon); 
    minLon = stationList.reduce(minLonFn, minLon);

    let maxLonFn = function(a,b) {
      if (! b || a > b.get('longitude')) { return a; } else { return b.get('longitude'); }
    };
    maxLon = originList.reduce(maxLonFn , maxLon); 
    maxLon = stationList.reduce(maxLonFn, maxLon);

    if (minLat === maxLat) { 
      minLat = minLat - 0.5;
      maxLat = maxLat + 0.5;
    }
    if (minLon === maxLon) {
      minLon = minLon - 0.5;
      maxLon = maxLon + 0.5;
    }
    return [ [minLat, minLon], [maxLat, maxLon] ];
  }.property('originList.@each.latitude', 'originList.@each.longitude',
             'stations.@each.latitude', 'stations.@each.longitude'),

});
