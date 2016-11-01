import Ember from 'ember';

export default Ember.Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);
    let eventsGet = this.get('events');
    this.fixEvents(eventsGet);
    const stations = this.get('stations') || [];
    this.fixStations(stations);
  },
  fixEvents(events) {
    if (events) {
      if ( ! Ember.isArray(events)) {
        this.set('eventList',  Ember.A( [events]));
  console.log(typeof events);
        console.log("event not array: "+events.get('prefOrigin').get('time'));
      } else {
        this.set('eventList', Ember.A(events));
        console.log("event array: "+events.length);
      }
    } else {
       this.set('eventList', Ember.A([]));
    }
  },
  fixStations(stations) {
    if (stations) {
      if ( ! Ember.isArray(stations)) {
        this.set('stationList', Ember.A([stations]));
        console.log("station not array: "+stations.get('codes'));
      } else {
        this.set('stationList', Ember.A(stations));
        console.log("station is array: "+stations.length);
      }
    } else {
      this.set('stationList', Ember.A({}));
    }
  } 
});
