import Model, { attr, belongsTo } from '@ember-data/model';
import {distaz,} from 'seisplotjs';

export default class QuakeStationModel extends Model {
    @attr('string') sodStatus;
    @attr('number') distdeg;
    @attr('number') azimuth;
    @attr('number') backazimuth;
    @belongsTo('quake') quake;
    @belongsTo('station') station;

    get distDegFormatted() {
      if (this.distdeg) {
        return this.distdeg.toFixed(2);
      } else {
        return "UNDEF";
      }
    }
    get distKmFormatted() {
      if (this.distdeg) {
        return distaz.degtokm(this.distdeg).toFixed(2);
      } else {
        return "UNDEF";
      }
    }
    get azimuthFormatted() {
      if (this.azimuth) {
        return this.azimuth.toFixed(2);
      } else {
        return "UNDEF";
      }
    }
    get backazimuthFormatted() {
      if (this.backazimuth) {
        return this.backazimuth.toFixed(2);
      } else {
        return "UNDEF";
      }
    }
}
