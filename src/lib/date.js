/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import moment from 'moment';
import { PING_LIFETIME } from './constants';

/**
 * Converts UTC date string to local timezone and formats it for display
 *
 * @param {string} utcDateString UTC string representing a date.
 * @returns {string} Formatted date: Month Day, Year, Hours:Minutes:Seconds.
 */
export function formatDate(utcDateString) {
  return moment(utcDateString).format('YYYY-MM-DD HH:mm:ss');
}

export function calculateDaysRemainingForPing(pingAddedAt) {
  const pingDate = moment(pingAddedAt);
  return PING_LIFETIME - moment().diff(pingDate, 'days');
}
