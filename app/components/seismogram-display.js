import Component from '@glimmer/component';
import { action } from '@ember/object';
import RSVP from 'rsvp';
import {d3, seismogram, seismographconfig, seismograph} from 'seisplotjs';

export default class SeismogramDisplayComponent extends Component {
  @action
  async createGraph(element) {
    let div = d3.select(element);
    if (this.args.quakeVector) {
      let seisConfig = new seismographconfig.SeismographConfig();
      if (this.args.title) {
        seisConfig.title = this.args.title;
      } else {
        let channels = await this.args.quakeVector.channels;
        if (channels) {
          seisConfig.title = "";
          channels.forEach( c => {
            seisConfig.title += c.locCode+"."+c.channelCode;
          });
        } else {
          seisConfig.title = "no channels...";
        }
      }
      seisConfig.margin.top = 25;
      //let seis = seismogram.Seismogram.createFromContiguousData(dataArray, sampleRate, start);
      //let waveforms = await RSVP.all(Array.from(this.args.quakeVector.waveforms));
      if ( ! this.args.quakeVector.waveforms || this.args.quakeVector.waveforms.length === 0) {
        div.append("h5").text("No data...");
      } else {
        let waveforms = await this.args.quakeVector.waveforms.map(w => w.loadWaveform());
        waveforms = await RSVP.all(waveforms);
        let seisDisplayDataList = [];
        for (const seis of waveforms) {
          let seisData = seismogram.SeismogramDisplayData.fromSeismogram(seis);
          seisDisplayDataList.push(seisData);
        }
        let graph = new seismograph.Seismograph(div, seisConfig, seisDisplayDataList);
        graph.draw();
        if (graph.checkResize()) {
          graph.draw();
        }
      }
    } else {
      div.append('p').text("SeismogramDisplay but no QV...");
    }
  }
}
