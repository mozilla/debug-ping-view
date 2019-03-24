
## Development
```
curl --header 'X-Debug-ID: test-debug-id' -XPOST https://stage.ingestion.nonprod.dataops.mozgcp.net/submit/glean/events/1/94743211-5996-034b-916c-147da723cc44 -d '{"ping_info":{"ping_type":"full","app_build":"59f330e5","app_display_version":"1.0.0","telemetry_sdk_build":"abcdabcd","client_id":"6ff20eb7-e80d-4452-b45f-2ea7e63547aa","seq":1,"start_time":"2018-10-23 11:23:15-04:00","end_time":"2018-10-23 11:23:15-04:25","first_run_date":"2018-10-23-04:25","experiments":{"experiment1":{"branch":"branch_a"},"experiment2":{"branch":"branch_b","extra":{"type":"experiment_type"}}}},"events":[[123456789,"examples","event_example",{"metadata1":"extra","metadata2":"more_extra"}],[123456791,"examples","event_example"]]}'
```

## Deployment
Cloud function:
```
firebase deploy --only functions
```

Creating PubSub subscription:
```
gcloud pubsub subscriptions create decoded-to-debugview --topic projects/moz-fx-data-shar-nonprod-efed/topics/structured-decoded --push-endpoint "https://us-central1-debug-ping-preview.cloudfunctions.net/ping/"
```
