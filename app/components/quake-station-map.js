import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A, isArray } from '@ember/array';

export default class QuakeStationMapComponent extends Component {
  @tracked zoomLevel = 1;
  @tracked pixelPerMagnitude = 3;
  get quakeList() {
    if (this.args.quakes) {
      if (isArray(this.args.quakes)) {
        return this.args.quakes;
      } else {
        return A([this.args.quakes]);
      }
    } else if (this.args.quakeStations) {
      return this.args.quakeStations.map(qs => qs.quake);
    }
    return A([]);
  }
  get stationList() {
    if (this.args.stations) {
      if (isArray(this.args.stations)) {
        return this.args.stations;
      } else {
        return A([this.args.stations]);
      }
      return this.args.stations;
    } else if (this.args.quakeStations) {
      return this.args.quakeStations.map(qs => qs.station);
    }
    return A([]);
  }
  get centerLat() {
    const b = this.bounds;
    return (b[0][0] + b[1][0])/2;
  }
  get centerLon() {
    const b = this.bounds;
    return (b[0][1] + b[1][1])/2;
  }
  get originList() {
    let out = this.quakeList.getEach('prefOrigin')
        .filter(o => o && o.get('latitude') && ! Number.isNaN(o.get('latitude')) && ! Number.isNaN(o.get('longitude')));
    return out;
  }
  get bounds() {
    let originList = this.originList ? this.originList : [];
    let stationList = this.stationList ? this.stationList : [];
    if ((! this.quakeList || this.quakeList.length == 0) && (! this.stationList || this.stationList.length == 0)) {
      return [ [ - 0.5, 0.5], [- 0.5, 0.5]]
    }
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
    if (degExpand > 10) {degExpand = 10;}
    maxLat += degExpand;
    if (maxLat > 90) { maxLat = 90.0;}
    minLat -= degExpand;
    if (minLat < -90) { minLat = -90.0;}
    maxLon += degExpand;
    minLon -= degExpand;

    return [ [minLat, minLon], [maxLat, maxLon] ];
  }
}
