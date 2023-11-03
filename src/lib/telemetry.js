/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Glean from '@mozilla/glean/web';
import { load, click } from '../glean/generated/page';

const APP_NAME = 'debug-ping-view';

/**
 * Check browser's `navigator.doNotTrack` property to determine the
 * telemetry preference i.e. whether telemetry can be collected or not.
 *
 * @returns {boolean} true if telemetry can be collected, else false.
 */
function isTelemetryEnabled() {
  // If the app is in development mode, we don't want to initialize Glean.
  if (process.env.REACT_APP_ENV !== 'prod') {
    return false;
  }

  return navigator.doNotTrack !== '1';
}

/**
 * Initialize telemetry client, setting it's upload status based on the current
 * telemetry preference.
 */
export function initTelemetryClient() {
  Glean.initialize(APP_NAME, isTelemetryEnabled(), { maxEvents: 1 });
}

/**
 * Update telemetry client's upload status.
 */
export function updateTelemetryClientUploadStatus() {
  Glean.setUploadEnabled(isTelemetryEnabled());
}

/**
 * Record a click event via telemetry client.
 *
 * @param {string} buttonLabel Label of the button that was clicked.
 */
export function recordClick(buttonLabel) {
  click.record({ button: buttonLabel });
}

/**
 * Record a page load event via telemetry client.
 *
 * @param {string} pageName Name of the page that was loaded.
 */
export function recordLoad(pageName) {
  load.record({ page: pageName });
}
