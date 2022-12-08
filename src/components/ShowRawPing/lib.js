/**
 * Filters all keys of an object into two arrays:
 *   1. `nestedKeys` - Keys that have complex objects as their value.
 *   2. `nonNestedKeys` - Keys that have primitive types as their value.
 *
 * The two arrays are returned in a custom object.
 *
 * @param {Object} obj Any javascript object.
 * @returns {{ nestedKeys: string[], nonNestedKeys: string[] }} A custom object
 *          containing arrays for `nested` and `nonNested` keys.
 */
export const getNestedAndNonNestedKeysFromObject = (obj) => {
  let nestedKeys = [];
  let nonNestedKeys = [];

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (typeof value === 'object') {
      nestedKeys.push(key);
    } else {
      nonNestedKeys.push(key);
    }
  });

  return {
    nestedKeys,
    nonNestedKeys
  };
};