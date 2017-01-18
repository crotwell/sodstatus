import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  calcTravelTimes(quake, station, model, phaseList) {
    return this.get('ajax').request("/api/taup?event="+quake.get('id')+"&station="+station.get('codes')+"&model="+model+"&phases="+phaseList);
  }
});
