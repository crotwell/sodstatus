import Model, {attr, belongsTo, hasMany } from '@ember-data/model';
import { action } from '@ember/object';
import RSVP from 'rsvp';

export default class PerusalModel extends Model {
  @attr('string') name;
  @attr('string') username;
  @attr('string') primarySort;
  @attr('string') eventSort;
  @attr('string') stationSort;
  @belongsTo('quake-station', {async: true}) first;
  @belongsTo('quake-station', {async: true}) prev;
  @belongsTo('quake-station') curr;
  @belongsTo('quake-station', {async: true}) next;
  @hasMany('measurement-tool') tools;

  @action
  goToFirst() {
    const mythis = this;
    return this.hashQuakeStation(this.get('first'))
    .then(() => {
      let f = this.get('first');
      this.setProperties({'prev': null, 'curr': f, 'next': null})
     })
     .then( () => mythis.save());
  }
  @action
  goToPrev() {
    const mythis = this;
    return this.hashQuakeStation(this.get('prev'))
      .then( () => {
        let n = this.get('prev');
        let c = this.get('curr');
        this.setProperties({'next': c, 'curr': n, 'prev': null});
      })
      .then( () => mythis.save())
      .then( () => console.log(`after goToPrev ${mythis.prev}`))
  }
  @action
  goToNext() {
    const mythis = this;
    return this.hashQuakeStation(this.get('next'))
      .then( () => {
        let n = this.get('next');
        let c = this.get('curr');
        this.setProperties({'prev': c, 'curr': n, 'next': null});
      })
      .then( () => mythis.save());
  }
  @action
  doSave() {
    console.log("doSave");
    this.save();
  }
  @action
  delete() {
    this.store.deleteRecord(this);
  }
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
       return RSVP.hash({
              qs: qs,
              staHash: qs.get('station').then(s => s.get('latitude')),
              netHash: qs.get('station').get('network'),
              quakeHash: qs.get('quake')
                  .then(function(q) {return q.get('prefOrigin');})
                  .then(function(o) {return o.get('latitude');})
                  .then(l => console.log("Got latitude: "+l)),
              qvHash: qs.get('ecps'),
              measurementHas: qs.get('measurements'),
              measurementAllHas: RSVP.all(Array.from(qs.get('measurements')))
        }).then(hash=> hash.qs)
        .then(qs=> {
          console.log(`hashQuakeStation ${qs}  ${qs.measurements}`);
          return qs;
        });
    } else {
      console.assert(false, "perusal.hashQuakeStation: ERROR qs is null!!!");
      return null;
    }
  }
}
