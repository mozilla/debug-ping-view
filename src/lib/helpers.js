import moment from 'moment';

/**
 * Converts UTC date string to local timezone and formats it for display
 */
export function FormatDate(utcDateString) {
  return moment(utcDateString).format('MMM D, YYYY, H:mm:ss');
}
