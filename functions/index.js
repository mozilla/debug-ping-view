const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({
    origin: true,
});

// Moments library to format dates.
const moment = require('moment');

const {gzip, ungzip} = require('node-gzip');

async function storePing(pubSubMessage, rawPing) {
  // Push the new message into Firestore
  console.log("storePing");



  
  return admin.firestore().collection('messages').add({p: rawPing}).then((writeResult)=>{
    console.log("WRITE RESULT: ", writeResult);
    return writeResult;
  });
}

async function handlePost(req, res) {
  // console.log("POST");
  const pubSubMessage = req.body.message;
  const namespace = pubSubMessage.attributes.document_namespace;
  const debugId = pubSubMessage.attributes.x_debug_id;
  const gleanDebugPing = namespace === "glean" && debugId;

  if (gleanDebugPing) {
    console.log("got glean debug ping");
    console.log(debugId);
  
    const pingPayload = Buffer.from(pubSubMessage.data, 'base64');
    console.log(req.body);
    console.log(namespace);
    console.log(pingPayload.toString());

    return ungzip(pingPayload).then((decompressed)=>{
      console.log(decompressed.toString());
      console.log("before storePing");
      return storePing(pubSubMessage, decompressed.toString());
    });
  } else {
    // console.log("got other ping");
    return Promise.resolve();
  }
}

/**
 * Cloud Function to be triggered by Pub/Sub push sunscription
 * that stores Glean debug pings in Firestore.
 */
exports.ping = functions.https.onRequest((req, res) => {
    // console.log("PING FUNCTION");
    
  
    // [START usingMiddleware]
    // Enable CORS using the `cors` express middleware.
    return cors(req, res, () => {

      switch (req.method) {
        case 'GET':
          console.log("GET");
          //https://stackoverflow.com/a/49743057/783904
          // return res.send(`<html><head><meta name="google-site-verification" content="${settings.google.siteVerificationCode}" /></head><body></body></html>`)
          return res.send(`<html><head><meta name="google-site-verification" content="FGveh31iPHURsXECLhzcauxkjdK3x3Sy8KA7RBlVz90" /></head><body></body></html>`)
        case 'POST':
          return handlePost(req, res).then(()=>{
            // A response with 204 status code is considered as an implicit acknowledgement.
            return res.status(204).end();
          });


          
        default:
          console.log('DEFAULT:', req);
          return res.status(403).send('Forbidden!');
      } 
    });
  });
