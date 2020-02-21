import { helper } from '@ember/component/helper'
import moment from 'moment';

export default helper(function formatIsoDate(params, hash) {
  if (typeof params[0] == 'undefined') return "";
  let defaultFormat = 'YYYY-MM-DD[T]HH:mm:ss.SSSS';
  let date = params[0];
  let format = hash.format===undefined ? defaultFormat : hash.format;
  if (date === undefined || date === null ) {
    return "";
  } else {
    return moment(date).utc().format(format);
  }
});
