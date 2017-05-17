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
console.log("hashQuakeStation: "+qs.get("id"));
    if (qs) {
console.log("qs "+qs.then);
       return qs.then( qs => {
          return Ember.RSVP.hash({
              qs: qs,
              staHash: qs.get('station').then(s => s.get('latitude')),
              netHash: qs.get('station').get('network'),
              quakeHash: qs.get('quake')
                  .then(function(q) {return q.get('prefOrigin');})
                  .then(function(o) {return o.get('latitude');}),
              measurementHas: qs.get('measurements')
          });
      }).then(() => console.log("hashQuakeStation done"));
    } else { console.log("ERROR qs is null!!!");return null;}
  }
});
