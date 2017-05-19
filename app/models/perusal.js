import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  username: DS.attr('string'),
  primarySort: DS.attr('string'),
  eventSort: DS.attr('string'),
  stationSort: DS.attr('string'),
  first: DS.belongsTo('quakeStation'),
  prev: DS.belongsTo('quakeStation'),
  curr: DS.belongsTo('quakeStation'),
  next: DS.belongsTo('quakeStation'),
  tools: DS.hasMany('measurementTool'),
  goToFirst() {
    return this.setProperties({'prev': null, 'curr': this.get('first'), 'next': null});
  },
  goToPrev() {
    return this.get('prev')
      .then(p => {
        let c = this.get('curr');
        this.setProperties({'prev': null, 'curr': p, 'next': c});
      });
  },
  goToNext() {
    return this.hashQuakeStation(this.get('next'))
      .then( () => { 
        let n = this.get('next');
        let c = this.get('curr');
        this.setProperties({'prev': c, 'curr': n, 'next': null});
      });
  },
  hashQuakeStation(qs) {
    let perusalThis = this;
    if (qs) {
       // kind of dumb, but sometimes qs is a promise and sometimes not
       if (qs.then) {
         return qs.then(r => {
           if (r) return perusalThis.hashQuakeStation(r)
           return r;
         });
       }
       return Ember.RSVP.hash({
              qs: qs,
              staHash: qs.get('station').then(s => s.get('latitude')),
              netHash: qs.get('station').get('network'),
              quakeHash: qs.get('quake')
                  .then(function(q) {return q.get('prefOrigin');})
                  .then(function(o) {return o.get('latitude');})
                  .then(l => console.log("Got latitude: "+l)),
              measurementHas: qs.get('measurements')
      });
    } else { 
      console.assert(false, "perusal.hashQuakeStation: ERROR qs is null!!!");
      return null;
    }
  }
});
