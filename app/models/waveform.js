import Model, { attr, belongsTo } from '@ember-data/model';
import * as seisplotjs from 'seisplotjs';

export default class WaveformModel extends Model {
  @attr('string') networkCode;
  @attr('string') stationCode;
  @attr('string') locCode;
  @attr('string') channelCode;
  @attr('date') startTime;
  @attr('date') endTime;
  @attr('string') filePath;
  @attr('string') fileType;
  @attr('string') dataUrl;
  @belongsTo('quake') quake;
  @belongsTo('channel') channel;


  loadWaveform() {
    const fetchInit = seisplotjs.util.defaultFetchInitObj(seisplotjs.miniseed.MINISEED_MIME);
    return seisplotjs.util.doFetchWithTimeout(this.dataUrl, fetchInit, 10)
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
