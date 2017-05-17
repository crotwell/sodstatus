import Ember from 'ember';
import RSVP from 'rsvp';
import seisplot from 'npm:seisplotjs';

let miniseed = seisplot.miniseed;
let waveformplot = seisplot.waveformplot;
let d3 = waveformplot.d3;

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
        let titleDiv = d3.select('#'+elementId).select("div");
        if ( ! titleDiv) {
          reject(new Error("Can't find titleDiv (id = "+elementId+")"));
          return;
        }
        
  
        for(let key in msByChan) {
          let dataArray = miniseed.merge(msByChan[key]);
          let startEndDates = that.calcStartEnd(dataArray, that.get('cookiejar'));
          titleDiv.append("h5").text(key);
          let svgDiv = titleDiv.append("div").classed("waveformPlot", true);
          let seischart = new waveformplot.chart(svgDiv, dataArray, startEndDates.start, startEndDates.end);
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
      return Ember.RSVP.hash({
        seisChartListHash: this.get('seischartList'),
        phaseHash: this.get('phases'),
        quakeHash: that.get('quake'),
        stationHash: that.get('station').get('network')
      }).then( hash => {
        let seischartList = this.get('seischartList');
        if ( ! that.get('phases') || ! that.get('quake') || ! that.get('station') || ! that.get('station').get('network')) {
          // only overlay arrivals if we have quake, station and phases
          // but do delete old markers
          for (let cNum=0; cNum < seischartList.length; cNum++) {
            seischartList[cNum].clearMarkers();
          }
          return;
        }
        let phaseList = that.get('phases').split(',');
console.log("phaseList: "+phaseList);
console.log("phaseList: "+phaseList.length);
        let onlyFirstP = phaseList.find(p => p === 'firstP');
        let onlyFirstS = phaseList.find(p => p === 'firstS');
        if (onlyFirstP) {
          phaseList = phaseList.filter(p => p != 'firstP')
              .concat(['P', 'p', 'Pdiff', 'PKP', 'PKIKP']);
        }
        if (onlyFirstS) {
          phaseList = phaseList.filter(p => p != 'firstS')
              .concat(['S', 's', 'Sdiff', 'SKS', 'SKIKS']);
        }
        return that.get('travelTime').calcTravelTimes(that.get('quake'), that.get('station'), "prem", phaseList.join())
          .then(function(json) {
            if (onlyFirstP) {
              let firstPArrival = json.included.find(a => a.attributes.phasename.startsWith('P') || a.attributes.phasename.startsWith('p'));
              json.included = json.included.filter( a => ! (a.attributes.phasename.startsWith('P') || a.attributes.phasename.startsWith('p')));
              json.included.push(firstPArrival);
            }
            if (onlyFirstS) {
              let firstSArrival = json.included.find(a => a.attributes.phasename.startsWith('S') || a.attributes.phasename.startsWith('s'));
              json.included = json.included.filter( a => ! (a.attributes.phasename.startsWith('S') || a.attributes.phasename.startsWith('s')));
              json.included.push(firstSArrival);
            }
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
          return waveformplot.findStartEnd(segments);
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
