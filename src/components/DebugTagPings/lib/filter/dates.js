import moment from 'moment';
import { PING_LIFETIME } from '../../../../lib/constants';
import { generateDateObjFromMonthAndDay } from './utils';

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
 * @param {string} startDate The `startDate` to filter on.
 * @returns {Object[]} All pings sent in after the `startDate`.
 */
export const filterOnStartDate = (pings, startDate) => {
  // If there is no filter applied, we return all pings.
  if (!startDate) {
    return pings;
  }

  // Iterate over all pings and look for ones that are after our `startDate`.
  return pings.filter((ping) => {
    // Create date object for the `startDate` to use for comparison.
    const startDateObj = generateDateObjFromMonthAndDay(startDate);

    // Make sure we start from the BEGINNING of the day.
    startDateObj.setHours(0, 0, 0, 0);

    // Create date object for current ping.
    const pingDate = new Date(ping.addedAt);

    // Check if the selected start date is earlier than the date of the ping.
    return startDateObj < pingDate;
  });
};

/**
 * Apply `endDate` filter to list of pings.
 *
 * @param {Object[]} pings All pings to filter.
 * @param {string} endDate The `endDate` to filter on.
 * @returns {Object[]} All pings sent in before the `endDate`.
 */
export const filterOnEndDate = (pings, endDate) => {
  // If there is no filter applied, we return all pings.
  if (!endDate) {
    return pings;
  }

  // Iterate over all pings and look for ones that are before our `endDate`.
  return pings.filter((ping) => {
    // Create date object for the `endDate` to use for comparison.
    const endDateObj = generateDateObjFromMonthAndDay(endDate);

    // Make sure we end at the END of the day.
    endDateObj.setHours(23, 59, 59, 999);

    // Create date object for current ping.
    const pingDate = new Date(ping.addedAt);

    // Check if the selected end date is after than the date of the ping.
    return pingDate < endDateObj;
  });
};
