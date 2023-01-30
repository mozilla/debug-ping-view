#!/usr/bin/env sh

# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

BASEDIR=$(dirname $0)
wget https://raw.githubusercontent.com/mozilla-services/mozilla-pipeline-schemas/main/schemas/glean/glean/glean.1.schema.json -O $BASEDIR/glean.1.schema.json