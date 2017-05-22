import Ember from 'ember';
import seisplot from 'npm:seisplotjs';

let miniseed = seisplot.miniseed;
let waveformplot = seisplot.waveformplot;
let d3 = waveformplot.d3;

export default Ember.Component.extend({
  travelTime: Ember.inject.service(),
  isOverlay: false,
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, 'updateGraph');
  },
  seischartList: [],
  updateGraph: function() {
    this.seischartList = [];
    let elementId = this.get('elementId');
    d3.select('#'+elementId).select("div.waveformPlotInnerDiv").selectAll("div").remove();
    this.get('waveformList').then(wList => {
      wList.forEach(ww => {
        this.appendWaveform(ww);
      });
      return this.drawPhases();
    });
  },
  appendWaveform: function(waveform) {
    let that = this;
    let seischartList = that.get('seischartList');
    let sharedXScale = null;
    if (seischartList.length != 0) {
      sharedXScale = seischartList[0].xScale;
    }
    let mslist = waveform.get('mseed');
    let msByChan = miniseed.byChannel(mslist);
    let elementId = this.get('elementId');
    for(let key in msByChan) {
      let mseedRecordArray = miniseed.merge(msByChan[key]);
      if (seischartList.length == 0 || ! this.get('isOverlay')) {
        let sc = this.initSeisChart(mseedRecordArray, key, sharedXScale);
        this.seischartList.push(sc);
        sc.scaleChangeListeners.push(this);
      } else {
        let title = seischartList[0].title;
        this.seischartList[0].append(mseedRecordArray);
        title += " "+key;
        d3.select('#'+elementId).select("div").select(".waveformPlotInnerDiv").select("div").select("h5").text(title);
        seischartList[0].setTitle(title);
      }
    }
  },
  initSeisChart: function(mseedRecords, title, sharedXScale) {
    let elementId = this.get('elementId');
    let titleDiv = d3.select('#'+elementId).select("div").select(".waveformPlotInnerDiv").append("div");
    if ( ! titleDiv) {
      throw new Error("Can't find titleDiv (id = "+elementId+")");
    }
        
    let startEndDates = this.calcStartEnd(mseedRecords, this.get('cookiejar'));
    titleDiv.append("h5").text(title);
    let svgDiv = titleDiv.append("div").classed("waveformPlot", true);
    let seischart = new waveformplot.chart(svgDiv, mseedRecords, startEndDates.start, startEndDates.end);
    if (sharedXScale) {
      seischart.xScale = sharedXScale;
    }
    seischart.setTitle(title);
    seischart.draw();
    return seischart;
  },
  drawPhases: function() {
      let that = this;
      return Ember.RSVP.hash({
        seisChartListHash: this.get('seischartList'),
        phaseHash: this.get('phases'),
        quakeHash: that.get('quake'),
        stationHash: that.get('station').get('network')
      }).then( () => {
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
    overlayOberver: Ember.observer('isOverlay', function() {
      this.updateGraph();
    }),
    waveformListOberver: Ember.observer('waveformList', function() {
      this.updateGraph();
    }),
    notifyScaleChange(xScale) {
      this.seischartList.forEach( sc => {
        if ( sc.currZoomXScale != xScale) {
          sc.redrawWithXScale(xScale);
        }
      });
    },

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
