import moment from 'moment';

/**
 * Converts UTC date string to local timezone and formats it for display
 *
 * @param {string} utcDateString UTC string representing a date.
 * @returns {string} Formatted date: Month Day, Year, Hours:Minutes:Seconds.
 */
export function formatDate(utcDateString) {
  return moment(utcDateString).format('YYYY-MM-DD HH:mm:ss');
}
