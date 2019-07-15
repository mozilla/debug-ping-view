const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const { gzip, ungzip } = require('node-gzip');

/**
 * Retrieves client id from provided JSON document;
 * If not present there, queries Firestore for the last clientId that used provided debugId;
 * If none is found, returns `UNKNOWN` string.
*/
async function getClientId(pingJson, debugId, db) {
    if (!pingJson || !pingJson.client_info || !pingJson.client_info.client_id) {
    // if clientId is missing, try to find last client with the current debug id, if none exists, substitute with `UNKNOWN`
    return db.collection("clients")
      .where("debugId", "==", debugId)
      .orderBy("lastActive", "desc")
      .limit(1).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
          return "UNKNOWN";
        } else {
          return querySnapshot.docs[0].get("clientId");
        }
      })
  } else {
    return Promise.resolve(pingJson.client_info.client_id);
  }
}

/**
 * Push ping data to Firestore
 */
async function storePing(pubSubMessage, rawPing, error) {
  const db = admin.firestore();

  const batch = db.batch();

  let pingJson = null;
  let os = null;
  try {
    // TODO: make sure this is safe if some fields are missing
    pingJson = JSON.parse(rawPing);
    os = pingJson.client_info.os + " " + pingJson.client_info.os_version;
  } catch (e) {
    // this is validation error
    console.error(`JSON parse error: ${e}, raw ping was: ${rawPing}`);
  }

  const appName = pubSubMessage.attributes.document_namespace;
  const geo = pubSubMessage.attributes.geo_city + ", " +
    pubSubMessage.attributes.geo_country;
  const debugId = pubSubMessage.attributes.x_debug_id;

  const clientRef = db.collection("clients").doc(debugId);
  batch.set(clientRef, {
    appName: appName,
    debugId: debugId,
    geo: geo,
    lastActive: pubSubMessage.publishTime,
    os: os,
  });

  const pingType = pubSubMessage.attributes.document_type;

  const pingRef = db.collection("pings").doc(pubSubMessage.attributes.document_id);
  const errorFields = error ? {
    error: true,
    errorType: pubSubMessage.attributes.error_type,
    errorMessage: pubSubMessage.attributes.error_message,
  } : {};
  const baseFields = {
    addedAt: pubSubMessage.publishTime,
    debugId: debugId,
    payload: rawPing,
    pingType: pingType,
  };
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
