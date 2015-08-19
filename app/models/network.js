import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  networkCode: DS.attr('string'),
  startTime: DS.attr('date'),
  endTime: DS.attr('date'),
  description: DS.attr('string'), 
  stations: DS.hasMany('station', { async: true }),

  isTempNet: Ember.computed('networkCode', function() {
    var first = this.get('networkCode').charAt(0);
console.log(' isTempNet : '+first);
    return first === 'X' || first === 'Y' || first === 'Z';
  }),
    startYear: Ember.computed('startTime', function() {
        return this.get('startTime').toISOString().substring(0,4);
    }),
  startTimeUTC: Ember.computed('startTime', function() {
    var s = this.get('startTime');
    if(s === null) {
      return "";
    } else {
      return s.toISOString();
    }
  }),
  endTimeUTC: Ember.computed('endTime', function() {
    if(this.get('endTime') === null) {
      return "";
    } else {
      return this.get('endTime').toISOString();
    }
  })
});
