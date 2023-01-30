/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// list of common errors - each entry is a tuple containing error string and user-friendly message
export const commonErrors = [
  [
    'com.mozilla.telemetry.schemas.SchemaNotFoundException: ',
    'Unknown ping type',
    "Unknown ping type - this is expected if you're developing a new ping or using local build with unregistered application id. Reach out to the telemetry team if you need help in setting up new schema."
  ],
  [
    'com.mozilla.telemetry.ingestion.core.schema.SchemaNotFoundException',
    'Unknown ping type',
    "Unknown ping type - this is expected if you're developing a new ping or using local build with unregistered application id. Reach out to the telemetry team if you need help in setting up new schema."
  ]
];

export const commonErrorTypes = [
  [
    'JSON_VALIDATION_ERROR_DEBUG_VIEW',
    "This ping did not pass validation during ingestion (this is normal if you're using custom developer build). Validation against Glean schema was attempted in Debug Viewer, but failed with error too:"
  ]
];
