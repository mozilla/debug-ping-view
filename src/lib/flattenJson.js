/**
 * Flattens a nested JSON object to a single level. The hierarchical ordering
 * is still maintained via concatenating nested structure to top-level key.
 *
 * I.E.
 * {
 *     value1: '',
 *     value2: {
 *         value3: {
 *             value4: ''
 *         }
 *     }
 * }
 * becomes
 * {
 *     value1: '',
 *     value2.value3.value4: ''
 * }
 *
 * Converted this Python implementation to JS, with a few minor adjustments.
 * https://towardsdatascience.com/how-to-flatten-deeply-nested-json-objects-in-non-recursive-elegant-python-55f96533103d
 *
 * Inspiration for this structure comes from Firefox's about:telemetry tab.
 * about:telemetry#environment-data-tab_system
 *
 * @param {Object} json Object generated from `JSON.parse`.
 * @returns {Object} Flattened JSON as described in the example above.
 */
export const flattenJson = (json) => {
  const flattenedObj = {};

  const flatten = (valueToFlatten, name = '') => {
    // The array value format is a bit different. The index of the array item
    // is wrapped in brackets.
    //
    // Note:
    // Arrays are technically JS objects, so this check has to be first or else
    // the array is just treated as an `object`.
    //
    // An array value might look something like `[0].value1.value2`.
    if (Array.isArray(valueToFlatten)) {
      let i = 0;
      valueToFlatten.forEach((value) => {
        flatten(value, `${name} [${i.toString()}].`);
        i += 1;
      });
    } else if (typeof valueToFlatten === 'object') {
      Object.keys(valueToFlatten).forEach((key) => {
        flatten(valueToFlatten[key], name + key + '.');
      });
    } else {
      // Keys will always have an extra period at the end that needs cut off.
      const formattedName = name.slice(0, -1);
      flattenedObj[formattedName] = valueToFlatten;
    }
  };

  // Kick off recursive calls of `flatten` until we've flattened the
  // entire object.
  flatten(json);

  return flattenedObj;
};
