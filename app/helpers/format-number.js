import Ember from 'ember';

export function formatNumber(params/*, hash*/) {
  let decimalDigits = params[1]===undefined ? 2 : params[1];
  return params[0].toFixed(decimalDigits);
}

export default Ember.Helper.helper(formatNumber);
