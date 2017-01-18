import Ember from 'ember';
import seisplot from 'npm:seisplotjs-waveformplot';
//import * as seisplot from 'npm:seisplotjs-waveformplot';
import d3 from 'npm:d3';
//import * as d3 from 'npm:d3';

let miniseed = seisplot.miniseed;

export default Ember.Component.extend({
  travelTime: Ember.inject.service(),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, 'updateGraph');
  },
  updateGraph: function() {
    let elementId = this.get('elementId');
    let that = this;
    this.get('waveform').then(function(waveform) {
      return new Promise(function(resolve, reject){
        let mslist = waveform.get('mseed');
        let msByChan = miniseed.byChannel(mslist);
        let seischartList = [];
  
        for(let key in msByChan) {
          let dataArray = seisplot.miniseed.merge(msByChan[key]);
          let dataArrayArray = [];
          dataArrayArray.push(dataArray );
          let titleDiv = d3.select('#'+elementId).select("div");
          titleDiv.append("h5").text(key);
          let svgDiv = titleDiv.append("div").classed("waveformPlot", true);
          let seischart = new seisplot.chart(svgDiv, dataArrayArray);
          seischart.draw();
          // seischart.enableDrag();
          // seischart.enableZoom();
          seischartList.push(seischart);
        }
        resolve(seischartList);
      });
    }).then(function(seischartList) {
      that.get('travelTime').calcTravelTimes(that.get('quake'), that.get('station'), "prem", "P,S,SPvmP")
          .then(function(json) {
            for (let cNum=0; cNum < seischartList.length; cNum++) {
              let markers = [];
              for (let aNum=0; aNum < json.included.length; aNum++) {
                let when = new Date(that.get('quake').get('prefOrigin').get('time').getTime()+json.included[aNum].attributes.traveltime*1000);
                markers.push({ name: json.included[aNum].attributes.phasename,
                               time: when });
              }
              seischartList[cNum].setMarkers(markers);
            }
          });
    });
  }
});
