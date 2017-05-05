import Ember from 'ember';
import moment from 'moment';

export function formatIsoDate(params, namedArgs) {
  if (typeof params[0] == 'undefined') return "";
  let defaultFormat = 'YYYY-MM-DD[T]HH:mm:ss.SSSS';
  let date = params[0];
  let format = namedArgs.format===undefined ? defaultFormat : namedArgs.format;
  if (date === undefined || date === null ) {
    return "";
  } else {
    return moment(date).utc().format(format);
  }
}

export default Ember.Helper.helper(formatIsoDate);
