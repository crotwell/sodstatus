import Component from '@glimmer/component';
import { action } from '@ember/object';
import {d3, moment, seismogram, seismographconfig, seismograph} from 'seisplotjs';

export default class SeismogramDisplayComponent extends Component {
  @action
  async createGraph(element) {
    let div = d3.select(element);
    let dataArray = new Float32Array(1000).map(function(d, i) {
      return Math.sin(2*Math.PI*i/100) * 100;
    });
    let sampleRate = 20;
    let start = moment.utc('2019-07-04T05:46:23Z');
    //let seis = seismogram.Seismogram.createFromContiguousData(dataArray, sampleRate, start);
    let seis  = await this.args.quakeVector.loadWaveform();
  console.log(`seis: ${seis}`);
  console.log(`seis: ${seis.numPoints} ${seis.sampleRate}`);
  console.log(`seis: ${seis.startTime} ${seis.startTime}`);
      //let elementId = this.get('elementId');
      let seisConfig = new seismographconfig.SeismographConfig();
      if (this.args.title) {
        seisConfig.title = this.args.title;
      } else {
        let channels = await this.args.quakeVector.channels;
        seisConfig.title = channels.getEach('channelCode');
      }
      seisConfig.margin.top = 25;
      let seisData = seismogram.SeismogramDisplayData.fromSeismogram(seis);
      let graph = new seismograph.Seismograph(div, seisConfig, seisData);
      graph.draw();
  }
}
