import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('arms');
  this.route('networks', function() {
    this.route('show', {
      path: ':network_id'},
      function() {
        this.route('stations');
      });
    });
  this.route('events');
  this.route('station', 
    {path: 'station/:station_id' },
    function() {
      this.route('events');
      this.route('event',
        {path: ':esp_id'});
    });
});

export default Router;
