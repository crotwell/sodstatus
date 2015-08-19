import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('arms');
  this.route('networks');
  this.route('events');
});

export default Router;
