import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { A } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';
import { computed } from '@ember/object';
import {distaz,} from 'seisplotjs';

export default class QuakeStationModel extends Model {
    @attr('string') sodStatus;
    @attr('number') distdeg;
    @attr('number') azimuth;
    @attr('number') backazimuth;
    @belongsTo('quake') quake;
    @belongsTo('station') station;
    @hasMany('quake-vector') ecps;
    @hasMany('measurement') measurements;

    get sortedQuakeVectors() {
      console.log("in sortedQuakeVectors")
      if (this.ecps) {
        //return this.ecps.sortBy('channels');
        const sortedQV = this.ecps.toArray();
        sortedQV.sort((a,b) => {
          const aName = a.channels.firstObject.locCode+"."+a.channels.firstObject.channelCode;
          const bName = b.channels.firstObject.locCode+"."+b.channels.firstObject.channelCode;
          if (aName < bName) {
            return -1;
          }
          if (aName > bName) {
            return 1;
          }
          return 0;
        });

        return ArrayProxy.create({ content: A(sortedQV) });
      } else {
        return [];
      }
    }
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
