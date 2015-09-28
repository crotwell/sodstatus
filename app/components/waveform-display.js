import Ember from 'ember';
import seisplot from 'npm:seisplotjs';
import d3 from 'npm:d3';

export default Ember.Component.extend({
  didInsertElement: function() {
console.log("didInsertElement "+this.get('elementId'));
    Ember.run.scheduleOnce('afterRender', this, 'updateGraph');
  },
  updateGraph: function() {
    let elementId = this.get('elementId');
    this.get('waveform').then(function(waveform) {
    let mslist = waveform.get('mseed');
    let msByChan = seisplot.miniseed.byChannel(mslist);

    for(let key in msByChan) {
        let dataArray = seisplot.miniseed.merge(msByChan[key]);
        let dataArrayArray = [ dataArray ];
    let svg = d3.select('#'+elementId).select("div");
    let seischart = new seisplot.waveformplot.chart(svg, dataArrayArray);
    seischart.draw();
    seischart.enableDrag();
    seischart.enableZoom();
    }
});
  }
});
