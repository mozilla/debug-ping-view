# Glean Debug View
This is a proof of concept web application for viewing Glean debug pings in real-time.

## Building
```
npm run build
```

## Development
Run application locally:
```
npm start
```

Send debug ping to GCP ingestion:
```
curl --header 'X-Debug-ID: test-debug-id' -XPOST https://stage.ingestion.nonprod.dataops.mozgcp.net/submit/glean/events/1/$(uuidgen) -d '{"ping_info":{"ping_type":"full","app_build":"59f330e5","app_display_version":"1.0.0","telemetry_sdk_build":"abcdabcd","client_id":"9ff20eb7-e80d-4452-b45f-2ea7e63547aa","seq":1,"start_time":"2018-10-23 11:23:15-04:00","end_time":"2018-10-23 11:23:15-04:25","first_run_date":"2018-10-23-04:25","experiments":{"experiment1":{"branch":"branch_a"},"experiment2":{"branch":"branch_b","extra":{"type":"experiment_type"}}}},"events":[[123456789,"examples","event_example",{"metadata1":"extra","metadata2":"more_extra"}],[123456791,"examples","event_example"]]}'
```

## Deployment
```
npm run build && firebase deploy
```
Go to https://debug-ping-preview.firebaseapp.com/

We can deploy only selected component, for example functions:
```
firebase deploy --only functions
```

Create PubSub subscription:
```
gcloud pubsub subscriptions create decoded-to-debugview --topic projects/moz-fx-data-shar-nonprod-efed/topics/structured-decoded --push-endpoint "https://us-central1-debug-ping-preview.cloudfunctions.net/debugPing/"
```

## Architecture
Clients are submitting pings to [Mozilla telemetry ingestion system](https://github.com/mozilla/gcp-ingestion). Pings tagged with `X-Debug-ID` header (e.g. `X-Debug-ID: test-name`) are picked up by [`debugPing` function](functions/index.js) and loaded to [Firestore](https://firebase.google.com/docs/firestore/).

Frontend is implemented with [React](https://reactjs.org/) hosted on [Firebase](https://firebase.google.com/docs/hosting/), it leverages Firestore's real-time query update capability.

![doc/data-flow.mmd](doc/data-flow.svg "Data flow diagram")

### Ingestion and data model
Pings from `structured-decoded` topic are pushed to [HTTP Function](functions/index.js) via [Push Subscription](https://cloud.google.com/pubsub/docs/subscriber#push-subscription). We can't use PubSub-triggered function here because it doesn't support cross-project access.

Glean debug pings with some fields extracted are stored in Firestore. There are two collections with flat documents used:
```
clients
+ key: string // client_id
+ debugId: string // value of the `X-Debug-ID` header
+ geo: string // city and country of the last submitted ping, from GeoIP
+ lastActive: string // timestamp of the last ping submission
```
```
pings
+ key: string // document_id
+ addedAt: string // submission timestamp
+ clientId: string
+ payload: string // submitted ping payload
+ pingType: string // document_type
```
Ping collection is [indexed](firestore.indexes.json).

### Web application
Views are leveraging Firestore's realtime query updates.

#### Authentication
Simple Google Signin-based authentication is inplace. It allows to log in with any Google account, although only those under `mozilla.com` domain are [allowed](firestore.rules) to fetch data from Firestore.