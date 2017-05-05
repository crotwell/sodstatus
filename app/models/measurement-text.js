import DS from 'ember-data';
import Measurement from './measurement';

export default Measurement.extend({
  value: DS.attr('string')
});
