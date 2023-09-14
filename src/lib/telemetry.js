/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Glean from '@mozilla/glean/web';

const APP_NAME = "debug-ping-view";
const APP_TELEMETRY_PREFERENCE_STORAGE_KEY = "telemetryEnabled";

function isTelemetryEnabled() {
  return navigator.doNotTrack !== "1";
}

function setAppTelemetryPreferenceInStorage(telemetryPreferenceValue) {
    sessionStorage.setItem(APP_TELEMETRY_PREFERENCE_STORAGE_KEY, telemetryPreferenceValue)
}

function getAppTelemetryPreferenceFromStorage() {
  return sessionStorage.getItem(APP_TELEMETRY_PREFERENCE_STORAGE_KEY);
}

// Initialize Glean.
export function initTelemetry() {
  const telemetryEnabled = isTelemetryEnabled();
  setAppTelemetryPreferenceInStorage(telemetryEnabled.toString());
  Glean.initialize(APP_NAME, telemetryEnabled, { maxEvents: 1 });
}

// Update Glean upload settings if user's consent to telemetry changes
export function updateTelemetry() {
  const appTelemetryPreference = getAppTelemetryPreferenceFromStorage();
  const telemetryEnabled = isTelemetryEnabled();
  if (appTelemetryPreference !== telemetryEnabled.toString()) {
    setAppTelemetryPreferenceInStorage(telemetryEnabled.toString())
    Glean.setUploadEnabled(telemetryEnabled)
  }
}
