import Component from '@glimmer/component';
import { action } from '@ember/object';
import RSVP from 'rsvp';
import {d3, moment, seismogram, seismographconfig, seismograph} from 'seisplotjs';

export default class SeismogramDisplayComponent extends Component {
  @action
  async createGraph(element) {
    let div = d3.select(element);

    let seisConfig = new seismographconfig.SeismographConfig();
    if (this.args.title) {
      seisConfig.title = this.args.title;
    } else {
      let channels = await this.args.quakeVector.channels;
      seisConfig.title = channels.getEach('channelCode');
    }
    seisConfig.margin.top = 25;
    //let seis = seismogram.Seismogram.createFromContiguousData(dataArray, sampleRate, start);
    //let waveforms = await RSVP.all(Array.from(this.args.quakeVector.waveforms));
    if (this.args.quakeVector.waveforms.length === 0) {
      div.append("h5").text("No data...");
    } else {
      console.log(this.args.quakeVector.waveforms)
      let waveforms = await this.args.quakeVector.waveforms.map(w => w.loadWaveform());
      waveforms = await RSVP.all(waveforms);
      let seisDisplayDataList = [];
      for (const seis of waveforms) {
        console.log(seis)
        console.log(`seis: ${seis}`);
        console.log(`seis: ${seis.numPoints} ${seis.sampleRate}`);
        console.log(`seis: ${seis.startTime} ${seis.startTime}`);
        let seisData = seismogram.SeismogramDisplayData.fromSeismogram(seis);
        seisDisplayDataList.push(seisData);
      }
      let graph = new seismograph.Seismograph(div, seisConfig, seisDisplayDataList);
      graph.draw();
      if (graph.checkResize()) {
        graph.draw();
      }
    }
  }
}
