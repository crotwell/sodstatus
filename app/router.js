import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('recipe');
  this.route('networks', function() {
    this.route('network', { path: '/:network_id' }, function() {});
  });
  this.route('station', { path: '/:station_id' });
  this.route('quakes', function() {
    this.route('quake', { path: '/:quake_id' }, function() {
      this.route('stations');
    });
  });
  this.route('stations', function() {
    this.route('station', { path: '/:station_id' }, function() {
      this.route('quakes');
    });
  });
  this.route('quake-stations', function() {
    this.route('quake-station', { path: '/:quake_station_id' });
  });
  this.route('arms');
  this.route('perusals', function() {
    this.route('perusal', { path: '/:perusal_id' });
    this.route('new');
  });
});
