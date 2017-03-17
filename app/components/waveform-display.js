import Ember from 'ember';
import RSVP from 'rsvp';
import seisplot from 'npm:seisplotjs-waveformplot';

let miniseed = seisplot.miniseed;
let d3 = seisplot.d3;

export default Ember.Component.extend({
  travelTime: Ember.inject.service(),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, 'updateGraph');
  },
  seischartList: [],
  updateGraph: function() {
    let elementId = this.get('elementId');
    let that = this;
    this.seischartList = [];
    this.get('waveform').then(function(waveform) {
      return new RSVP.Promise(function(resolve, reject){
        let mslist = waveform.get('mseed');
        let msByChan = miniseed.byChannel(mslist);
        let seischartList = that.get('seischartList');
        let firstChart = null;
  
        for(let key in msByChan) {
          let dataArray = seisplot.miniseed.merge(msByChan[key]);
          let startEndDates = that.calcStartEnd(dataArray, that.get('cookiejar'));
          let titleDiv = d3.select('#'+elementId).select("div");
          titleDiv.append("h5").text(key);
          let svgDiv = titleDiv.append("div").classed("waveformPlot", true);
          let seischart = new seisplot.chart(svgDiv, dataArray, startEndDates.start, startEndDates.end);
          seischart.draw();
          seischartList.push(seischart);
        }
        resolve(seischartList);
      });
    }).then(function(seischartList) {
      return that.drawPhases();
    });
  },
  drawPhases: function() {
      let that = this;
      let seischartList = this.get('seischartList');
      if ( ! that.get('phases') || ! that.get('quake') || ! that.get('station')) {
        // only overlay arrivals if we have quake, station and phases
        // but do delete old markers
        for (let cNum=0; cNum < seischartList.length; cNum++) {
          seischartList[cNum].clearMarkers();
        }
        return;
      }
      that.get('travelTime').calcTravelTimes(that.get('quake'), that.get('station'), "prem", that.get('phases'))
          .then(function(json) {
            for (let cNum=0; cNum < seischartList.length; cNum++) {
              let markers = [];
              for (let aNum=0; aNum < json.included.length; aNum++) {
                let when = new Date(that.get('quake').get('prefOrigin').get('time').getTime()+json.included[aNum].attributes.traveltime*1000);
                markers.push({ id: json.included[aNum].id,
                               name: json.included[aNum].attributes.phasename,
                               markertype: 'predicted',
                               time: when });
              }
              // delete old markers
              seischartList[cNum].clearMarkers([]);
              seischartList[cNum].appendMarkers(markers);
            }
          });
    },
    phasesOberver: Ember.observer('phases', function() {
      this.drawPhases();
    }),

    calcStartEnd: function(segments, cookieJar) {
      if (cookieJar && cookieJar.request) {
        let out = {
          start: cookieJar.request[0].start,
          end: cookieJar.request[0].end
        };
        for(let i=0; i<cookieJar.request.length; i++) {
          if (cookieJar.request[i].start < out.start) {
            out.start = cookieJar.request[i].start;
          } 
          if (cookieJar.request[i].end > out.end) {
            out.end = cookieJar.request[i].end;
          } 
        }
        return out;
      } else {
          return seisplot.findStartEnd(segments);
      }
    },
    actions: {
      resetZoom() {
        let seischartList = this.get('seischartList');
        for (let cNum=0; cNum < seischartList.length; cNum++) {
            seischartList[cNum].resetZoom();
        }
      },
    }
});
