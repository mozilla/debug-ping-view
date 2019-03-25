const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const { gzip, ungzip } = require('node-gzip');

/**
 * Push ping data to Firestore
 */
async function storePing(pubSubMessage, rawPing) {
  const db = admin.firestore();

  var batch = db.batch();

  const clientId = JSON.parse(rawPing).ping_info.client_id;

  var clientRef = db.collection("clients").doc(clientId);
  batch.set(clientRef, { lastActive: pubSubMessage.publishTime });

  var pingRef = db.collection("pings").doc(pubSubMessage.attributes.document_id);
  batch.set(pingRef, {
    clientId: clientId,
    payload: rawPing,
    addedAt: pubSubMessage.publishTime
  });

  return batch.commit();
}

async function handlePost(req, res) {
  const pubSubMessage = req.body.message;
  const namespace = pubSubMessage.attributes.document_namespace;
  const debugId = pubSubMessage.attributes.x_debug_id;
  const gleanDebugPing = namespace === "glean" && debugId;

  if (gleanDebugPing) {
    console.log("got glean debug ping");
    const pingPayload = Buffer.from(pubSubMessage.data, 'base64');
    console.log(pubSubMessage);

    return ungzip(pingPayload).then((decompressed) => {
      return storePing(pubSubMessage, decompressed.toString());
    });
  } else {
    return Promise.resolve();
  }
}

/**
 * Cloud Function to be triggered by Pub/Sub push sunscription
 * that stores Glean debug pings in Firestore.
 */
exports.debugPing = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case 'GET':
      // Domain ownership verification
      return res.send(`<html><head><meta name="google-site-verification" content="FGveh31iPHURsXECLhzcauxkjdK3x3Sy8KA7RBlVz90" /></head><body></body></html>`)
    case 'POST':
      return handlePost(req, res).then(() => {
        // A response with 204 status code is considered as an implicit acknowledgement.
        return res.status(204).end();
      });
    default:
      return res.status(403).send('Forbidden!');
  }
});

