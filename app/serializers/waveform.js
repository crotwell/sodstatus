import DS from 'ember-data';
import SP from 'npm:seisplotjs';

export default DS.RESTSerializer.extend({
  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    var mslist = SP.miniseed.parseDataRecords(payload.data);
    var msByChan = SP.miniseed.byChannel(mslist);
    var out = {};
    for(let key in msByChan) {
        out[key] = SP.miniseed.merge(msByChan[key]);
    }
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
    throw new Error("waveform serializer serialize no impl yet");
  },
});
