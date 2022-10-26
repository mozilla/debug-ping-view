export const defaultPayload = `{
  "$schema": "moz://mozilla.org/schemas/glean/ping/2",
  "ping_info": {
    "ping_type": "full",
    "app_build": "59f330e5",
    "app_display_version": "1.0.0",
    "telemetry_sdk_build": "abcdabcd",
    "client_id": "{{CLIENT_ID}}",
    "seq": 1,
    "start_time": "2018-10-23 11:23:15-04:00",
    "end_time": "2018-10-23 11:23:15-04:25"
  },
  "metrics": {
    "boolean": {
      "examples.boolean_example": true
    },
    "string": {
      "examples.string_example": "\u82f1\u6f22\u5b57\u5178"
    },
    "number": {
      "examples.number_example": 5
    },
    "string_list": {
      "examples.string_list_example": [
        "A",
        "B",
        "C"
      ]
    },
    "enumeration": {
      "examples.enumeration_example": "value1"
    },
    "counter": {
      "examples.counter_example": 42
    },
    "timespan": {
      "examples.timespan_example": {
        "value": 2,
        "time_unit": "second"
      }
    },
    "timing_distribution": {
      "examples.timespan_distribution_example": {
        "range": [
          1,
          100000
        ],
        "bucket_count": 50,
        "histogram_type": "exponential",
        "values": {
          "13": 0,
          "16": 2,
          "31": 3,
          "76": 1,
          "95": 5,
          "149": 1,
          "186": 1,
          "233": 2,
          "1122": 1,
          "1757": 1,
          "2753": 1,
          "3446": 1,
          "13255": 1,
          "1000005": 1
        },
        "underflow": 52,
        "overflow": 3,
        "time_unit": "second"
      }
    },
    "datetime": {
      "examples.datetime_example": "2018-09-13T19:08:00Z"
    },
    "use_counter": {
      "examples.use_counter_example": {
        "values": {
          "assert": 2,
          "clear": 4,
          "table": 5
        },
        "denominator": {
          "name": "session_length",
          "value": 100
        }
      }
    },
    "usage": {
      "examples.usage_example": true
    },
    "rate": {
      "examples.rate_example": 23
    }
  },
  "events": [
    [123456789, "examples", "event_example", "button", "42", {"metadata1": "extra", "metadata2": "more_extra"}]
  ]
}

`;
