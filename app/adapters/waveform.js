import Ember from 'ember';
import DS from 'ember-data';
import Waveform from '../models/waveform';

console.log("In waveform adapter");

export default DS.Adapter.extend({
  xxxfindMany: function(store, type, ids, snapshots) {
    alert("#########################findMany: "+type+" "+ids);
    return this._super().findMany(store, type, ids, snapshots);
  },

  xxxqueryRecord: function(store, type, query) {
    alert("#########################query: "+type+" "+query);
  },
  findRecord: function(store, type, id, snapshot) {
    var url = ['api',type.modelName, id].join('/');
    console.log("#########################find record: "+type+" "+id+"  "+url);

    return new Ember.RSVP.Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
//        xhr.onereadystatechange = handler;
        xhr.setRequestHeader('Accept', 'application/vnd.fdsn.mseed');
        xhr.onload = handler;
//function(e) {
//console.log("onload");
//};
        xhr.send();
        console.log("send for "+url);
        function handler(e) {
console.log("handler: "+this.readyState+"  "+this.status);
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
            console.log("handler onload");
            //Do your stuff here
            var normData = store.normalize('waveform',{
               data: {
                 id: id,
                 type: type,
                 mseed: "dummy.response"
                 //mseed: xhr.response
               }
            });
            console.log("after norm, before push "+id+" "+type+"  norm: "+normData);
            //var data = store.push('waveform', normData);
            resolve(normData);
              //resolve(this.response);
            } else {
              reject(new Error('get miniseed: `' + url + '` failed with status: [' + this.status + ']'));
            }
          }
        }
    });
  },
  xxxfindAll: function(store, type, sinceToken) {
    alert("#########################find all: "+type);
    var url = type;
    var query = { since: sinceToken };
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.get(url, query).then(function(data) {
        Ember.run(null, resolve, data);
      }, function(jqXHR) {
        jqXHR.then = null; // tame jQuery's ill mannered promises
        Ember.run(null, reject, jqXHR);
      });
    });
  }

});
