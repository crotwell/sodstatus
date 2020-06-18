import { helper } from '@ember/component/helper';

export default helper(function add360(lon) {
  return lon + 360;
});
