import Ember from 'ember';

export function formatNumberExp(params/*, hash*/) {
  let decimalDigits = params[1]===undefined ? 2 : params[1];
  return params[0].toExponential(decimalDigits);
}

export default Ember.Helper.helper(formatNumberExp);
