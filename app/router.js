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
});
