#!/bin/bash
# Simple linting script to avoid Firebase CLI npm compatibility issues
cd "$(dirname "$0")"
npx eslint .
