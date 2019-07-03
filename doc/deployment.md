# Deployment
This projects leverages two GCP projects to separate development and production environments:
* `glean-debug-view-dev-237806` - dev project
* `debug-ping-preview` - production

## Building React frontend
React application contains environment-specific configuration, therefore for deployment to one of the environments it needs to be built with corresponding profile. It can be controlled with `REACT_APP_ENV` environment variable.

In order to prepare production build, run:
```
REACT_APP_ENV=prod npm run build
```
For development build we can omit `APP_ENV` parameter:
```
npm run build
```

## Deploying
For deploying to production, switch firebase to production project:
```
firebase use prod
```
for development environment:
```
firebase use dev
```
Then project can be deployed with:
```
firebase deploy
```
We can also deploy only selected component, for example functions:
```
firebase deploy --only functions
```

## PubSub configuration
PubSub subscriptions are needed to consume pings from the pipeline. For production project run:
```
gcloud pubsub subscriptions create decoded-debug-to-debugview --topic projects/moz-fx-data-shar-nonprod-efed/topics/structured-decoded-debug --push-endpoint "https://us-central1-debug-ping-preview.cloudfunctions.net/debugPing/"

gcloud pubsub subscriptions create structured-errors-to-debugview --topic projects/moz-fx-data-shar-nonprod-efed/topics/structured-error --push-endpoint "https://us-central1-debug-ping-preview.cloudfunctions.net/decoderError/"
```
and
```
gcloud pubsub subscriptions create prod-decoded-debug-to-debugview --topic projects/moz-fx-data-shared-prod/topics/structured-decoded-debug --push-endpoint "https://us-central1-debug-ping-preview.cloudfunctions.net/debugPing/"

gcloud pubsub subscriptions create prod-structured-errors-to-debugview --topic projects/moz-fx-data-shared-prod/topics/structured-error --push-endpoint "https://us-central1-debug-ping-preview.cloudfunctions.net/decoderError/"
```

For dev:
```
gcloud pubsub subscriptions create decoded-debug-to-debugview --topic projects/moz-fx-data-shar-nonprod-efed/topics/structured-decoded-debug --push-endpoint "https://us-central1-glean-debug-view-dev-237806.cloudfunctions.net/debugPing/"

gcloud pubsub subscriptions create structured-errors-to-debugview --topic projects/moz-fx-data-shar-nonprod-efed/topics/structured-error --push-endpoint "https://us-central1-glean-debug-view-dev-237806.cloudfunctions.net/decoderError/"
```
and
```
gcloud pubsub subscriptions create prod-decoded-debug-to-debugview --topic projects/moz-fx-data-shared-prod/topics/structured-decoded-debug --push-endpoint "https://us-central1-glean-debug-view-dev-237806.cloudfunctions.net/debugPing/"

gcloud pubsub subscriptions create prod-structured-errors-to-debugview --topic projects/moz-fx-data-shared-prod/topics/structured-error --push-endpoint "https://us-central1-glean-debug-view-dev-237806.cloudfunctions.net/decoderError/"
```

Note that we need two sets of subscriptions for each environment here because historically Glean client was submitting debug pings directly to staging GCP endpoint. We are [changing](https://github.com/mozilla-mobile/android-components/pull/3343) this and moving to standard endpoint, but until the old version is still in use we need to read from both projects.