import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
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
  this.route('quakes', function() {
        this.route('show', {
          path: ':quake_id'},
          function() {
            this.route('stations');
          });
       });
  this.route('station', 
    {path: 'station/:station_id' },
    function() {
      this.route('quakes', function() {
        this.route('show', function() {
          this.route('stations');
        });
      });
      this.route('quake',
        {path: ':esp_id'});
    });
  this.route('channel',
    {path: 'channel/:channel_id'});
  this.route('recipe');
  this.route('perusals', function() {
    this.route('new');

    this.route('show', {
      path: ':perusal_id'
    });
  });
});

export default Router;
