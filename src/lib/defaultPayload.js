/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export const defaultPayload = `{
  "metrics": {
    "boolean": { "for_testing.boolean": false },
    "labeled_boolean": { "for_testing.labeled_boolean": { "a_label": true } },
    "counter": { "for_testing.counter": 10 },
    "labeled_counter": { "for_testing.labeled_counter": { "a_label": 1 } },
    "datetime": { "for_testing.datetime": "2022-12-13T15:00:00.117-05:00" },
    "labeled_string": { "for_testing.labeled_string": { "a_label": "ho" } },
    "string": { "for_testing.string": "let's go" },
    "quantity": { "for_testing.quantity": 42 },
    "string_list": { "for_testing.string_list": ["let's go"] },
    "text": { "for_testing.text": "let's gooooooooo" },
    "timespan": { "for_testing.timespan": { "time_unit": "millisecond", "value": 10 } },
    "uuid": { "for_testing.uuid": "835c99cf-cbc1-4d46-a5a8-02af10f87645" },
    "url": { "for_testing.url": "glean://test" },
    "rate": { "for_testing.rate": { "numerator": 1, "denominator": 2 } },
    "timing_distribution": {
      "for_testing.timing_distribution": { "values": { "30048": 1 }, "sum": 31500 }
    },
    "memory_distribution": {
      "for_testing.memory_distribution": { "values": { "96785": 1 }, "sum": 100000 }
    },
    "custom_distribution": {
      "for_testing.custom_distribution_exp": { "sum": 1, "values": { "1": 1 } },
      "for_testing.custom_distribution_linear": { "sum": 1, "values": { "1": 1 } }
    }
  },
  "events": [
    {
      "category": "for_testing",
      "name": "event",
      "timestamp": 0,
      "extra": { "sample_string": "hey", "sample_boolean": "false", "sample_quantity": "42" }
    }
  ],
  "ping_info": {
    "seq": 0,
    "start_time": "2022-12-13T14:59-05:00",
    "end_time": "2022-12-13T15:00-05:00"
  },
  "client_info": {
    "telemetry_sdk_build": "1.3.0",
    "client_id": "e53f7aa3-c413-4b7a-a1bf-7deba7f334b9",
    "first_run_date": "2022-12-13-05:00",
    "os": "Unknown",
    "os_version": "Unknown",
    "architecture": "Unknown",
    "locale": "Unknown",
    "app_build": "Unknown",
    "app_display_version": "Unknown"
  }
}

`;

export const defaultPayloadOnlyMetrics = `{
  "metrics": {
    "boolean": { "for_testing.boolean": false },
    "labeled_boolean": { "for_testing.labeled_boolean": { "a_label": true } },
    "counter": { "for_testing.counter": 10 },
    "labeled_counter": { "for_testing.labeled_counter": { "a_label": 1 } },
    "datetime": { "for_testing.datetime": "2022-12-13T15:00:00.117-05:00" },
    "labeled_string": { "for_testing.labeled_string": { "a_label": "ho" } },
    "string": { "for_testing.string": "let's go" },
    "quantity": { "for_testing.quantity": 42 },
    "string_list": { "for_testing.string_list": ["let's go"] },
    "text": { "for_testing.text": "let's gooooooooo" },
    "timespan": { "for_testing.timespan": { "time_unit": "millisecond", "value": 10 } },
    "uuid": { "for_testing.uuid": "835c99cf-cbc1-4d46-a5a8-02af10f87645" },
    "url": { "for_testing.url": "glean://test" },
    "rate": { "for_testing.rate": { "numerator": 1, "denominator": 2 } },
    "timing_distribution": {
      "for_testing.timing_distribution": { "values": { "30048": 1 }, "sum": 31500 }
    },
    "memory_distribution": {
      "for_testing.memory_distribution": { "values": { "96785": 1 }, "sum": 100000 }
    },
    "custom_distribution": {
      "for_testing.custom_distribution_exp": { "sum": 1, "values": { "1": 1 } },
      "for_testing.custom_distribution_linear": { "sum": 1, "values": { "1": 1 } }
    }
  },
  "ping_info": {
    "seq": 0,
    "start_time": "2022-12-13T14:59-05:00",
    "end_time": "2022-12-13T15:00-05:00"
  },
  "client_info": {
    "telemetry_sdk_build": "1.3.0",
    "client_id": "e53f7aa3-c413-4b7a-a1bf-7deba7f334b9",
    "first_run_date": "2022-12-13-05:00",
    "os": "Unknown",
    "os_version": "Unknown",
    "architecture": "Unknown",
    "locale": "Unknown",
    "app_build": "Unknown",
    "app_display_version": "Unknown"
  }
}

`;

export const defaultPayloadOnlyEvents = `{
  "events": [
    {
      "category": "for_testing",
      "name": "event",
      "timestamp": 0,
      "extra": { "sample_string": "hey", "sample_boolean": "false", "sample_quantity": "42" }
    }
  ],
  "ping_info": {
    "seq": 0,
    "start_time": "2022-12-13T14:59-05:00",
    "end_time": "2022-12-13T15:00-05:00"
  },
  "client_info": {
    "telemetry_sdk_build": "1.3.0",
    "client_id": "e53f7aa3-c413-4b7a-a1bf-7deba7f334b9",
    "first_run_date": "2022-12-13-05:00",
    "os": "Unknown",
    "os_version": "Unknown",
    "architecture": "Unknown",
    "locale": "Unknown",
    "app_build": "Unknown",
    "app_display_version": "Unknown"
  }
}

`;

export const defaultPayloadNoEventsOrMetrics = `{
  "ping_info": {
    "seq": 0,
    "start_time": "2022-12-13T14:59-05:00",
    "end_time": "2022-12-13T15:00-05:00"
  },
  "client_info": {
    "telemetry_sdk_build": "1.3.0",
    "client_id": "e53f7aa3-c413-4b7a-a1bf-7deba7f334b9",
    "first_run_date": "2022-12-13-05:00",
    "os": "Unknown",
    "os_version": "Unknown",
    "architecture": "Unknown",
    "locale": "Unknown",
    "app_build": "Unknown",
    "app_display_version": "Unknown"
  }
}

`;
