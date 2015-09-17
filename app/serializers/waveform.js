import DS from 'ember-data';
import seisplot from 'npm:seisplotjs';

export default DS.RESTSerializer.extend({
  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    var ms = seisplot.miniseed;
    var mslist = seisplot.miniseed.parseDataRecords(payload);
let mslength = mslist.length;
let totalPts = 0;
for(let i=0; i<mslength; i++) {
totalPts = totalPts + mslist[i].length;
}
console.log("load data, total pts="+totalPts);
    var msByChan = seisplot.miniseed.byChannel(mslist);
    var out = {};
    for(let key in msByChan) {
        out[key] = seisplot.miniseed.merge(msByChan[key]);
    }
    var mseed = {  byChan: out }
    var jsonapi = {
               data: {
                 id: id,
                 type: primaryModelClass.modelName,
                 attributes: {
                     numRecords: mslist.length,
                     mseed: mslist
                 }
               }
           };
return jsonapi;
  },

  serialize: function(record, options) {
    console.log("waveform serializer normalizeResponse");
  },
  dummy: 'dummy'
});
