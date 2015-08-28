import Ember from 'ember';
import DS from 'ember-data';
import Waveform from '../models/waveform';

console.log("In waveform adapter");

export default DS.Adapter.extend({
  findRecord: function(store, type, id, snapshot) {
    var url = ['api',type.modelName, id].join('/');
    console.log("#########################find record: "+type+" "+id+"  "+url);

    return new Ember.RSVP.Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.setRequestHeader('Accept', 'application/vnd.fdsn.mseed');
        xhr.onload = handler;
        xhr.onerror = handler;
        xhr.send();
        console.log("send for "+url);
        function handler(e) {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              console.log("handler onload "+xhr.response.byteLength);
              resolve(xhr.response);
            } else {
              reject(new Error('get miniseed: `' + url + '` failed with status: [' + this.status + ']'));
            }
          }
        }
    });
  },
  findAll: function(store, type, sinceToken) {
    throw "findAll not impl yet";
  },
  createRecord: function(store, type, snapshot) {
    throw "createRecord not impl yet";
  },
  deleteRecord: function(store, type, snapshot) {
    throw "deleteRecord not impl yet";
  },
  queryRecord: function(store, type, query) {
    alert("#########################query: "+type+" "+query);
  },
});
