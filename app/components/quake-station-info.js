import Ember from 'ember';

export default Ember.Component.extend({
  cookieNames: function() {
    for (let quakeVector in this.get('ecps')) {
      let cookies = quakeVector.get('cookieJar');
console.log("cookieJar: "+cookies);
      let out = [];
      for (var cName in cookies) {
        if (cookieJar.hasOwnProperty(cName)) {
          out.push(cName);
console.log("cookie: "+cName);
        }
      }
    }
    return out;
  }.property('cookieJar')
});
