import Ember from 'ember';

export default Ember.Component.extend({
  cookieNames: function() {
    let out = [];
    for (let quakeVector in this.get('ecps')) {
      let cookies = quakeVector.get('cookieJar');
console.log("cookieJar: "+cookies);
      for (var cName in cookies) {
        if (this.get('cookieJar').hasOwnProperty(cName)) {
          out.push(cName);
console.log("cookie: "+cName);
        }
      }
    }
    return out;
  }.property('cookieJar')
});
