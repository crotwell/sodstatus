import Ember from 'ember';
import seisplot from 'npm:seisplotjs-waveformplot';
//import * as seisplot from 'npm:seisplotjs-waveformplot';
import d3 from 'npm:d3';
//import * as d3 from 'npm:d3';

let miniseed = seisplot.miniseed;

export default Ember.Component.extend({
  didInsertElement: function() {
console.log("didInsertElement "+this.get('elementId'));
    Ember.run.scheduleOnce('afterRender', this, 'updateGraph');
  },
  updateGraph: function() {
    let elementId = this.get('elementId');
    this.get('waveform').then(function(waveform) {
    let mslist = waveform.get('mseed');
    let msByChan = miniseed.byChannel(mslist);

    for(let key in msByChan) {
        let dataArray = seisplot.miniseed.merge(msByChan[key]);
        let dataArrayArray = [ dataArray ];
    let svgDiv = d3.select('#'+elementId).select("div");
    let seischart = new seisplot.chart(svgDiv, dataArrayArray);
    seischart.draw();
    seischart.enableDrag();
    seischart.enableZoom();
    }
});
  }
});
