/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Glean from '@mozilla/glean/web';

const APP_NAME = 'debug-ping-view';
const APP_TELEMETRY_PREFERENCE_STORAGE_KEY = 'telemetryEnabled';

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
 * Set the current telemetry preference in `window.sessionStorage` object.
 *
 * @param {string} telemetryPreferenceValue a string (either 'true' or 'false')
 *                                          representing telemetry preference
 */
function setAppTelemetryPreferenceInStorage(telemetryPreferenceValue) {
  sessionStorage.setItem(APP_TELEMETRY_PREFERENCE_STORAGE_KEY, telemetryPreferenceValue);
}

/**
 * Get the current telemetry preference from `window.sessionStorage` object.
 *
 * @returns {string} a string (either 'true' or 'false')
 */
function getAppTelemetryPreferenceFromStorage() {
  return sessionStorage.getItem(APP_TELEMETRY_PREFERENCE_STORAGE_KEY);
}

/**
 * Initialize telemetry client, setting it's upload status based on the current
 * telemetry preference.
 */
export function initTelemetryClient() {
  const telemetryEnabled = isTelemetryEnabled();
  setAppTelemetryPreferenceInStorage(telemetryEnabled.toString());
  Glean.initialize(APP_NAME, telemetryEnabled, { maxEvents: 1 });
}

/**
 * Update telemetry client's upload status if telemetry preference changed.
 */
export function updateTelemetryClientUploadStatus() {
  const appTelemetryPreference = getAppTelemetryPreferenceFromStorage();
  const telemetryEnabled = isTelemetryEnabled();
  if (appTelemetryPreference !== telemetryEnabled.toString()) {
    setAppTelemetryPreferenceInStorage(telemetryEnabled.toString());
    Glean.setUploadEnabled(telemetryEnabled);
  }
}
