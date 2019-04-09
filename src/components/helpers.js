import * as moment from 'moment';

/**
 * Converts UTC date string to lcoal timezone and formats it for display
 */
export function FormatDate(utcDateString) {
    return moment(utcDateString).format("MMM D, YYYY, H:mm:ss");
}

export function TruncateString(str, n) {
    return (str.length > n) ? str.substr(0, n - 1) : str;
};
