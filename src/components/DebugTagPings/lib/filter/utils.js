/**
 * If the key already exists in the map, increment its count. If the key
 * doesn't already exist, add it and give it an initial value of 1.
 *
 * @param {Map} map The map to add to.
 * @param {string} key The key we are adding.
 * @returns {Map} The map with the updated key and value added.
 */
export const insertOrIncrementValueInMapByKey = (map, key) => {
  // The key already exists, so we increment the previous count
  // and set the value again.
  if (map.has(key)) {
    const previousCount = map.get(key);
    map.set(key, previousCount + 1);
  } else {
    // We haven't seen this key before, set it with a value of 1.
    map.set(key, 1);
  }
  return map;
};

/**
 * Sort the entries of a map by its values in descending order and return
 * the keys.
 *
 * @param {Map} map Key-value pairs of keys and counts.
 * @returns {string[]} All map keys in descending order of their values.
 */
export const getMapKeysInDescendingOrderByValue = (map) => {
  // Sort the entries by their values in descending order.
  const entries = [...map].sort((a, b) => b[1] - a[1]);

  // We only need to return just the key, not the values.
  return entries.map((entry) => entry[0]);
};
