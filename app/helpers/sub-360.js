import { helper } from '@ember/component/helper';

export default helper(function sub360(lon) {
  return lon - 360;
});
