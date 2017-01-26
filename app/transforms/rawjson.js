import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
console.log("rawjson deserialize");
    return serialized;
  },

  serialize(deserialized) {
console.log("rawjson serialize");
    return deserialized;
  }
});
