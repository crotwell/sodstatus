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
console.log("QSMap plotQuakeList");
    return this.get('quakeList')
      .filter(q => q && q.get('prefOrigin')) // skip without origin
      .map(function(q) {
      if (typeof q == 'undefined') {
        console.log("q underined: "+q);
      } else {
        console.log("q : "+q);
      }
      console.log("get prefOrigin: "+q.get('prefOrigin'));
      return {
        latitude: q.get('prefOrigin').get('latitude'),
        longitude: q.get('prefOrigin').get('longitude'),
        scaledMag: q.get('prefMagnitude') ? q.get('prefMagnitude').get('value')*this.get('magToPixelScale') : this.get('magToPixelScale'),
        quake: q
      };
    }, this);
  }.property('quakeList', 'quakeList.@each.prefOrigin', 'quakeList.@each.prefMagnitude'),

  originList: function() {
console.log("originList");
    let out = this.get('quakeList').getEach('prefOrigin')
        .filter(o => o && o.get('latitude') && ! Number.isNaN(o.get('latitude')) && ! Number.isNaN(o.get('longitude')));
    console.log("originList return "+out.length); 
    if (out.length > 0) console.log("   originList[0]="+out[0].get('latitude'));
    return out;
  }.property('quakeList.@each.prefOrigin'),

  stationList: function() {
console.log("stationList");
    let stations = this.get('stations');
    let out = [];
    if (stations) {
      if ( ! Ember.isArray(stations)) {
        out = [ stations ];
      } else {
        out = stations;
      }
    }
    out = out
        .filter(s => s && s.get('latitude') && ! Number.isNaN(s.get('latitude')) && ! Number.isNaN(s.get('longitude')));
    console.log("stationList return "+out.length);
    if (out.length > 0) console.log("   stationList[0]="+out[0].get('latitude'));
    return out;
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

    // min 1 deg
    if (Math.abs(maxLat-minLat) < 1) { 
      minLat = (minLat+maxLat)/2 - 0.5;
      maxLat = (minLat+maxLat)/2 + 0.5;
    }
    if (Math.abs(maxLon-minLon) < 1) { 
      minLon = (minLon+maxLon)/2 - 0.5;
      maxLon = (minLon+maxLon)/2 + 0.5;
    }

    // expand by 50%, 25% on each edge
    let degExpand = Math.max(maxLon-minLon, maxLat-minLat)*0.25;
    maxLat += degExpand;
    minLat -= degExpand;
    maxLon += degExpand;
    minLon -= degExpand;

    return [ [minLat, minLon], [maxLat, maxLon] ];
  }.property('originList.@each.latitude', 'originList.@each.longitude',
             'stations.@each.latitude', 'stations.@each.longitude'),

});
