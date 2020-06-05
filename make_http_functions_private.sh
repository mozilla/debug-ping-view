#!/usr/bin/env bash
#set -o xtrace

# Firebase CLI deploys all HTTP functions with public access
# This script makes them private
# TODO: these functions can be deployed via gcloud with ingress set to internal-only
# see https://github.com/firebase/firebase-tools/issues/2285

declare -a httpFunctions=("debugPing" "decoderError")

for f in "${httpFunctions[@]}"
do
  if [[ $(gcloud functions get-iam-policy $f --project=$GCLOUD_PROJECT | grep allUsers) ]]; then
    gcloud functions remove-iam-policy-binding \
      $f \
      --member=allUsers \
      --role=roles/cloudfunctions.invoker \
      --project=$GCLOUD_PROJECT
  fi
done
