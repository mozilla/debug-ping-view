
## Development
Sending debug ping:
```
curl --header 'X-Debug-ID: test-debug-id' -XPOST https://stage.ingestion.nonprod.dataops.mozgcp.net/submit/glean/events/1/$(uuidgen) -d '{"ping_info":{"ping_type":"full","app_build":"59f330e5","app_display_version":"1.0.0","telemetry_sdk_build":"abcdabcd","client_id":"9ff20eb7-e80d-4452-b45f-2ea7e63547aa","seq":1,"start_time":"2018-10-23 11:23:15-04:00","end_time":"2018-10-23 11:23:15-04:25","first_run_date":"2018-10-23-04:25","experiments":{"experiment1":{"branch":"branch_a"},"experiment2":{"branch":"branch_b","extra":{"type":"experiment_type"}}}},"events":[[123456789,"examples","event_example",{"metadata1":"extra","metadata2":"more_extra"}],[123456791,"examples","event_example"]]}'
```

## Deployment
Cloud functions:
```
firebase deploy --only functions
```

Creating PubSub subscription:
```
gcloud pubsub subscriptions create decoded-to-debugview --topic projects/moz-fx-data-shar-nonprod-efed/topics/structured-decoded --push-endpoint "https://us-central1-debug-ping-preview.cloudfunctions.net/debugPing/"
```

## Error stream ping validation
Apart from displaying decoded pings and error messages, we try to validate all Glean pings from the error stream (`structured-error` Pub/Sub topic). This is useful for custom application builds that are not [registered in probe-scraper](https://github.com/mozilla/probe-scraper/blob/master/repositories.yaml), as their pings do not pass pipeline validation.

Validator uses Glean schema stored in Firestore. [Schema loader](schemaLoader.js) function is periodically polling `schemas_build_id` label on the `org_mozilla_fenix_stable.baseline_v1` table and updating Firestore entry to keep it in sync with production.
