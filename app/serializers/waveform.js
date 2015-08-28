import DS from 'ember-data';
import ms from 'miniseed';

export default DS.RESTSerializer.extend({
  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    console.log("waveform serializer normalizeResponse "+id+" "+requestType+" "+primaryModelClass.modelName+" "+payload.byteLength+" bytes");
    var mslist = ms.parseDataRecords(payload);
    return {
               data: {
                 id: id,
                 type: primaryModelClass.modelName,
                 attributes: {
                 mseed: "dummy.response "+mslist.length
                 }
                 //mseed: xhr.response
               }
           };
  },

  serialize: function(record, options) {
    console.log("waveform serializer normalizeResponse");
  },
  dummy: 'dummy'
});
