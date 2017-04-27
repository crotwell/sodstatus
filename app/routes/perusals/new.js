import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let p = this.store.createRecord('perusal');
    p.set('eventSort', 'time');
    p.set('stationSort', 'alpha');
    p.set('primarySort', 'quake');
    return p;
  }
});
