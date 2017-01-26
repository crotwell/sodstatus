import Ember from 'ember';

export default Ember.Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);
    let out = [];
    const rJ = this.get('rawJson');
    if (typeof rJ === 'string' || typeof rJ === 'number' || typeof rJ === 'boolean') {
      this.set('isSimple', true);
      if (typeof rJ === 'number') {
        this.set('isNumber', true);
      } else {
        this.set('isNumber', false);
      }
      this.set('value', rJ);
      this.set('tagName', 'span');
    } else if (typeof rJ === 'object' && Array.isArray(rJ)) {
      this.set('isSimple', false);
      this.set('isArray', true);
    } else if (typeof rJ === 'object') {
      this.set('isSimple', false);
      for (var property in rJ) {
        if (rJ.hasOwnProperty(property)) {
          out.push(property);
        }
      }
      this.set('keys', out);
    } else {
      this.set('isSimple', true);
      this.set("value", "unknown: "+rJ);
      this.set('tagName', 'span');
    }
  }
});
