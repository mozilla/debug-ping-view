/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const { gzip, ungzip } = require('node-gzip');
const fs = require('fs');
const util = require('util');

async function getJsonValidator() {
  console.log("Creating schema validator...")

  // first, try fetching latest schema from Firestore
  const db = admin.firestore();
  const latestSchema = await db.collection('glean_schemas').doc('latest').get();
  let schema;
  let schemaVersion;
  if (latestSchema.exists) {
    console.log('Using schema from Firestore');
    const data = latestSchema.data();
    schema = data.schema;
    schemaVersion = data.deployTimestamp;
  } else {
    // if there's no schema in Firestore, fall back to bundled one
    console.log("Using bundled schema");
    const readFile = util.promisify(fs.readFile);
    schema = await readFile('schema/glean.1.schema.json');
    schemaVersion = "bundled";
  }

  const gleanSchema = schema;

  const Ajv = require('ajv');
  const ajv = new Ajv({unknownFormats: ["datetime", "json"]});
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
  return {
    validator: ajv.compile(JSON.parse(gleanSchema.toString())),
    schemaVersion: schemaVersion,
  };
}

const schemaValidator = getJsonValidator();

// Firestore document size limit is approximately 1MB, but we'll use a conservative limit
const MAX_PAYLOAD_SIZE = 900000; // 900KB to leave room for other fields

/**
 * Truncates a payload if it exceeds the maximum size limit
 */
function truncatePayloadIfNeeded(payload) {
  const payloadSize = Buffer.byteLength(payload, 'utf8');
  if (payloadSize <= MAX_PAYLOAD_SIZE) {
    return payload;
  }

  console.warn(`Payload size (${payloadSize} bytes) exceeds limit. Truncating to ${MAX_PAYLOAD_SIZE} bytes.`);
  
  // Truncate the payload and add a note
  const truncatedPayload = payload.substring(0, MAX_PAYLOAD_SIZE - 200); // Leave room for truncation message
  const truncationNote = `\n\n[TRUNCATED: Original payload was ${payloadSize} bytes, truncated to fit Firestore limits]`;
  
  return truncatedPayload + truncationNote;
}

/**
 * Push ping data to Firestore
 */
async function storePing(pubSubMessage, rawPing, error) {
  const db = admin.firestore();

  const batch = db.batch();

  let pingJson = null;
  let os = "???";
  try {
    // TODO: make sure this is safe if some fields are missing
    pingJson = JSON.parse(rawPing);
    os = sanitize(pingJson.client_info.os) + " " + sanitize(pingJson.client_info.os_version);
  } catch (e) {
    // this is validation error
    console.error(`JSON parse error: ${e}, raw ping was: ${rawPing}`);
  }

  const appName = sanitize(pubSubMessage.attributes.document_namespace);
  const geo = sanitize(pubSubMessage.attributes.geo_city) + ", " +
    sanitize(pubSubMessage.attributes.geo_country);
  const debugId = sanitize(pubSubMessage.attributes.x_debug_id);

  const clientRef = db.collection("clients").doc(debugId);
  batch.set(clientRef, {
    appName: appName,
    debugId: debugId,
    geo: geo,
    lastActive: pubSubMessage.publishTime,
    os: os,
  });

  const pingType = pubSubMessage.attributes.document_type;

  // Handle payload truncation if needed
  const payload = truncatePayloadIfNeeded(rawPing);

  const pingRef = db.collection("pings").doc(pubSubMessage.attributes.document_id);
  const errorFields = await revalidateAndGetErrorFields(pubSubMessage, rawPing, error);
  const baseFields = {
    addedAt: pubSubMessage.publishTime,
    debugId: debugId,
    payload: payload,
    pingType: pingType,
  };

  batch.set(pingRef, {
    ...baseFields,
    ...errorFields,
  });

  return batch.commit();
}

function sanitize(value) {
  // eslint-disable-next-line no-eq-null
  return value == null ? "???" : value;
}

/**
 * Builds set of error fields.
 * If provided ping originates from error stream and is a Glean one, tries to validate it against Glean schema.
 */
async function revalidateAndGetErrorFields(pubSubMessage, rawPing, error) {
  if (error) {
    // Glean ping from unreleased or development app - let's validate against Glean schema
    const validator = await schemaValidator;
    const validate = validator.validator;
    const schemaVersion = validator.schemaVersion;

    let errorMessage = null;
    let valid = false;

    try {
      valid = validate(JSON.parse(rawPing));
      errorMessage = JSON.stringify(validate.errors);
    } catch (e) {
      errorMessage = e.toString();
    }

    return valid ? {
      warning: 'JSON_VALIDATION_IN_DEBUG_VIEW',
      debugViewSchemaVersion: schemaVersion,
    } : {
      error: true,
      errorType: 'JSON_VALIDATION_ERROR_DEBUG_VIEW',
      errorMessage: errorMessage,
      debugViewSchemaVersion: schemaVersion,
    };
  } else {
    return error ? {
      error: true,
      errorType: pubSubMessage.attributes.error_type,
      errorMessage: pubSubMessage.attributes.error_message,
    } : {};
  }
}

async function handlePost(req, res, error) {
  const pubSubMessage = req.body.message;
  const debugId = pubSubMessage.attributes.x_debug_id;

  // TODO: we should create a list of Glean applications and check the namespace below against it
  // const namespace = pubSubMessage.attributes.document_namespace;
  // const gleanDebugPing = namespace === "glean" && debugId;
  const gleanDebugPing = debugId;

  // document_id is used as the key in Firestore, so we can't store a ping without it
  if (gleanDebugPing && pubSubMessage.attributes.document_id != null) { // eslint-disable-line no-eq-null
    const pingPayload = Buffer.from(pubSubMessage.data, 'base64');

    return ungzip(pingPayload).then((decompressed) => {
      return storePing(pubSubMessage, decompressed.toString(), error);
    });
  } else {
    return Promise.resolve();
  }
}

/**
 * Cloud Function to be triggered by Pub/Sub push subscription
 * that stores Glean debug pings in Firestore.
 */
exports.debugPing = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case 'GET':
      // Domain ownership verification
      return res.send(`<html><head><meta name="google-site-verification" content="FGveh31iPHURsXECLhzcauxkjdK3x3Sy8KA7RBlVz90" /></head><body></body></html>`)
    case 'POST':
      return handlePost(req, res, false).then(() => {
        // A response with 204 status code is considered as an implicit acknowledgement.
        return res.status(204).end();
      });
    default:
      return res.status(403).send('Forbidden!');
  }
});

/**
 * Cloud Function to be triggered by Pub/Sub push subscription
 * that stores Glean ping validation errors in Firestore.
 */
exports.decoderError = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case 'GET':
      // Domain ownership verification
      return res.send(`<html><head><meta name="google-site-verification" content="FGveh31iPHURsXECLhzcauxkjdK3x3Sy8KA7RBlVz90" /></head><body></body></html>`)
    case 'POST':
      return handlePost(req, res, true).then(() => {
        // A response with 204 status code is considered as an implicit acknowledgement.
        return res.status(204).end();
      });
    default:
      return res.status(403).send('Forbidden!');
  }
});

const schemaLoader = require('./schemaLoader');
exports.gleanSchemaLoader = schemaLoader.gleanSchemaLoader;

const garbageCollector = require('./garbageCollector');
exports.removeOutdatedPings = garbageCollector.removeOutdatedPings;
