import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    console.log("waveform serializer normalizeResponse "+id+" "+requestType+" "+primaryModelClass.modelName);
    return {
               data: {
                 id: id,
                 type: primaryModelClass.modelName,
                 attributes: {
                 mseed: "dummy.response"
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
