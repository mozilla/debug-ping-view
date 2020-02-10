#!/usr/bin/env sh
BASEDIR=$(dirname $0)
wget https://raw.githubusercontent.com/mozilla-services/mozilla-pipeline-schemas/master/schemas/glean/glean/glean.1.schema.json -O $BASEDIR/glean.1.schema.json