import moment from 'moment';

/**
 * Converts UTC date string to local timezone and formats it for display
 *
 * @param {string} utcDateString UTC string representing a date.
 * @returns {string} Formatted date: Month Day, Year, Hours:Minutes:Seconds.
 */
export function formatDate(utcDateString) {
  return moment(utcDateString).format('MMM D, YYYY, H:mm:ss');
}

/**
 * Converts ISO date string to local timezone and displays month and day.
 *
 * @param {string} isoString Original ISO string representing a date.
 * @returns {string} Formatted date: MM/DD.
 */
export function formatDay(isoString) {
  return moment(isoString).format('MM/DD');
}
