import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import * as seisplotjs from 'seisplotjs';

export default class QuakeVectorModel extends Model {
    @attr('string') sodStatus;
    @attr('number') distdeg;
    @attr('number') azimuth;
    @attr('number') backazimuth;
    @belongsTo('quake') quake;
    @hasMany('channel') channels;
    @attr('string') cookieJar;
    @belongsTo('waveform', {async: true}) waveform;

    get waveformURL() {
      let adapter = this.store.adapterFor('waveform');
      let ref = this.belongsTo('waveform');
      if (ref.remoteType() === "id") {
        let id = ref.id();
        return adapter.buildURL('waveform', ref.id());
      } else if (ref.remoteType() === "link") {
        return ref.link();
      //}
      //if (this.waveform) {
      //  return adapter.buildURL('waveform', this.waveform.get('id'));
      } else {
        return "UNDEF";
      }
    }
    loadWaveform() {
      const mythis = this;
      const fetchInit = seisplotjs.util.defaultFetchInitObj(seisplotjs.miniseed.MINISEED_MIME);
      return seisplotjs.util.doFetchWithTimeout(this.waveformURL, fetchInit, 10)
      .then(response => {
        if (response.status === 204 ) {
          // no data
          return new ArrayBuffer(0);
        } else {
          return response.arrayBuffer();
        }
      }).then(rawBuffer => {
        let dataRecords = seisplotjs.miniseed.parseDataRecords(rawBuffer);
        let seisPerChan = seisplotjs.miniseed.seismogramPerChannel(dataRecords);
        console.log(`Got ${seisPerChan.length} seismograms`);
        return seisPerChan[0];
      });
    }
}
