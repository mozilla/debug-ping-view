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
 * Takes a string formatted MM/DD and returns a JS `Date` object.
 *
 * @param {string} monthAndDayFormattedString String formatted MM/DD.
 * @returns {Date} Date object for the specific month and day.
 */
export const generateDateObjFromMonthAndDay = (monthAndDayFormattedString) => {
  // Current display format is MM/DD, so we can pull values via split.
  const [month, day] = monthAndDayFormattedString.split('/');

  // Create our new Date object to compare against our ping date.
  const date = new Date();

  // Set the month and day from our `endDate`.
  date.setMonth(Number(month) - 1);
  date.setDate(Number(day));

  return date;
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
