const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const { gzip, ungzip } = require('node-gzip');

/**
 * Push ping data to Firestore
 */
async function storePing(pubSubMessage, rawPing, error) {
  const db = admin.firestore();

  var batch = db.batch();

  // TODO: make sure this is safe if some fields are missing
  const pingJson = JSON.parse(rawPing);

  if (!pingJson.client_info || !pingJson.client_info.client_id) {
    // if clientId is missing, that's probably validation error and we don't have a good way to present this in the view
    return Promise.resolve("Missing client_id");
  }
  const clientId = pingJson.client_info.client_id;

  const os = pingJson.client_info.os + " " + pingJson.client_info.os_version;
  const appName = pubSubMessage.attributes.document_namespace;
  const debugId = pubSubMessage.attributes.x_debug_id;
  const geo = pubSubMessage.attributes.geo_city + ", " +
    pubSubMessage.attributes.geo_country;

  const clientDebugId = clientId + "_" + debugId;

  var clientRef = db.collection("clients").doc(clientDebugId);
  batch.set(clientRef, {
    appName: appName,
    clientId: clientId,
    debugId: debugId,
    geo: geo,
    lastActive: pubSubMessage.publishTime,
    os: os,
  });

  const pingType = pubSubMessage.attributes.document_type;

  var pingRef = db.collection("pings").doc(pubSubMessage.attributes.document_id);
  const errorFields = error ? {
    error: true,
    errorType: pubSubMessage.attributes.error_type,
    errorMessage: pubSubMessage.attributes.error_message,
  } : {}
  const baseFields = {
    addedAt: pubSubMessage.publishTime,
    clientId: clientId,
    debugId: debugId,
    payload: rawPing,
    pingType: pingType,
  }
  batch.set(pingRef, {
    ...baseFields,
    ...errorFields,
  });

  return batch.commit();
}

async function handlePost(req, res, error) {
  const pubSubMessage = req.body.message;
  const debugId = pubSubMessage.attributes.x_debug_id;

  // TODO: we should create a list of Glean applications and check the namespace below against it
  // const namespace = pubSubMessage.attributes.document_namespace;
  // const gleanDebugPing = namespace === "glean" && debugId;
  const gleanDebugPing = debugId;

  if (gleanDebugPing) {
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
