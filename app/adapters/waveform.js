import Ember from 'ember';
import DS from 'ember-data';
import Waveform from '../models/waveform';

console.log("In waveform adapter");

export default DS.Adapter.extend({
  findRecord: function(store, type, id, snapshot) {
    var url = ['/api',type.modelName, id].join('/');

    return new Ember.RSVP.Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.setRequestHeader('Accept', 'application/vnd.fdsn.mseed');
        xhr.onload = handler;
        xhr.onerror = handler;
        xhr.send();
        function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              let data = xhr.response;
// return object with arraybuffer inside as ember only allows object or array
              resolve({data: data}); 
            } else {
              reject(new Error('get miniseed: `' + url + '` failed with status: [' + this.status + ']'));
            }
          } else {
            reject(new Error("handler called but readyState not DONE"+this.readyState));
          }
        }
    });
  },
  findAll: function(store, type, sinceToken) {
    throw new Error("findAll not impl yet: "+type);
  },
  createRecord: function(store, type, snapshot) {
    throw new Error("createRecord not impl yet: "+type);
  },
  deleteRecord: function(store, type, snapshot) {
    throw new Error("deleteRecord not impl yet: "+type);
  },
  queryRecord: function(store, type, query) {
    throw new Error("query not impl yet: "+type+" "+query);
  },
});
