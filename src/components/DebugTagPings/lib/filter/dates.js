import moment from 'moment';
import { PING_LIFETIME } from '../../../../lib/constants';

/**
 * Generate a list of MM/DD formatted dates for the last N days where
 * N is the `PING_LIFETIME`.
 *
 * @returns {string[]} Days in MM/DD format for the last N days where N is the
 *                     `PING_LIFETIME`.
 */
export const getDaysInPingLifetime = () => {
  const daysInPingLifetime = [];

  for (let i = 0; i < PING_LIFETIME; i++) {
    const day = moment().subtract(i, 'days');
    const formattedDay = day.format('MM/DD');

    daysInPingLifetime.push(formattedDay);
  }

  return daysInPingLifetime;
};

/**
 * Apply `startDate` filter to list of pings.
 *
 * @param {Object[]} pings All pings to filter.
 * @param {string} startDateStr The `startDate` to filter on.
 * @returns {Object[]} All pings sent in after the `startDate`.
 */
export const filterOnStartDate = (pings, startDateStr) => {
  // If there is no filter applied, we return all pings.
  if (!startDateStr) {
    return pings;
  }

  // Create the date object from the BEGINNING of the day.
  const startDate = moment(`${startDateStr}/${moment().year()}`, 'MM/DD/YYYY').startOf('day');

  // Iterate over all pings and look for ones that are after our `startDate`.
  return pings.filter((ping) => {
    // Create moment for the current ping.
    const pingDate = moment(ping.addedAt);

    return startDate.isSameOrBefore(pingDate);
  });
};

/**
 * Apply `endDate` filter to list of pings.
 *
 * @param {Object[]} pings All pings to filter.
 * @param {string} endDateStr The `endDate` to filter on.
 * @returns {Object[]} All pings sent in before the `endDate`.
 */
export const filterOnEndDate = (pings, endDateStr) => {
  // If there is no filter applied, we return all pings.
  if (!endDateStr) {
    return pings;
  }

  // Create the date object from the BEGINNING of the NEXT day.
  const endDate = moment(`${endDateStr}/${moment().year()}`, 'MM/DD/YYYY')
    .add(1, 'days')
    .startOf('day');

  // Iterate over all pings and look for ones that are before our `endDate`.
  return pings.filter((ping) => {
    // Create moment for the current ping.
    const pingDate = moment(ping.addedAt);

    return pingDate.isSameOrBefore(endDate);
  });
};
