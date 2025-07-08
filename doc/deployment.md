# Deployment

This projects leverages two GCP projects to separate development and production environments:

* `glean-debug-view-dev-237806` - dev project
* `debug-ping-preview` - production

React application contains environment-specific configuration, therefore for deployment to one of the environments it needs to be built with corresponding profile.
It can be controlled with `REACT_APP_ENV` environment variable.

## Deploy a development build

Build the React frontend:

```
REACT_APP_ENV=dev npm run build
```

Deploy the frontend:

```
firebase use dev
firebase deploy --only hosting
```

## Deploy a production build

Build the React frontend:

```
REACT_APP_ENV=prod npm run build
```

Deploy the frontend:

```
firebase use prod
firebase deploy --only hosting
```

## Deploy the functions

First select the right environment.

For the development environment:

```
firebase use dev
```

For the production environment:

```
fireabase use prod
```

Then deploy the functions:

```
firebase deploy --only functions
```

## PubSub configuration

_Note: This should be rarely needed as PubSub is already deployed and configured correctly._

PubSub subscriptions are needed to consume pings from the pipeline. They are pushing messages to non-public
HTTP functions, therefore need to authenticate. Here's how to configure them:

First, select the project id:
For production run:

```shell script
PROJECT_ID=debug-ping-preview
```

For dev:

```shell script
PROJECT_ID=glean-debug-view-dev-237806
```

Then create subscriptions:

```shell script
PROJECT_NUMBER=$(gcloud projects list --filter="$PROJECT_ID" --format="value(PROJECT_NUMBER)")

gcloud config set project $PROJECT_ID

# grant Cloud Pub/Sub the permission to create tokens
PUBSUB_SERVICE_ACCOUNT="service-${PROJECT_NUMBER}@gcp-sa-pubsub.iam.gserviceaccount.com"
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
 --member="serviceAccount:${PUBSUB_SERVICE_ACCOUNT}"\
 --role='roles/iam.serviceAccountTokenCreator'

gcloud pubsub subscriptions create prod-decoded-debug-to-debugview --topic projects/moz-fx-data-shared-prod/topics/structured-decoded-debug --push-endpoint "https://us-central1-${PROJECT_ID}.cloudfunctions.net/debugPing" --push-auth-service-account=${PROJECT_ID}@appspot.gserviceaccount.com

gcloud pubsub subscriptions create prod-structured-errors-to-debugview --topic projects/moz-fx-data-shared-prod/topics/structured-error --push-endpoint "https://us-central1-${PROJECT_ID}.cloudfunctions.net/decoderError" --push-auth-service-account=${PROJECT_ID}@appspot.gserviceaccount.com
```
