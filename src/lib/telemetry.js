/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Glean from '@mozilla/glean/web';

const APP_NAME = 'debug-ping-view';

/**
 * Check browser's `navigator.doNotTrack` property to determine the
 * telemetry preference i.e. whether telemetry can be collected or not.
 *
 * @returns {boolean} true if telemetry can be collected, else false.
 */
function isTelemetryEnabled() {
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
