const functions = require('firebase-functions');
const admin = require('firebase-admin');

const axios = require('axios');
const {BigQuery} = require('@google-cloud/bigquery');


/* Fetch version of latest schemas deployed to the Fenix Baseline table */
async function getGleanBuildIdLabel() {
  const bigquery = new BigQuery({projectId: "moz-fx-data-shared-prod"});

  const datasetId = "org_mozilla_fenix_stable";
  const tableId = "baseline_v1";

  // Retrieve current dataset metadata.
  const table = bigquery.dataset(datasetId).table(tableId);
  const [metadata] = await table.getMetadata();
  const labels = metadata.labels;

  let schemasBuildIdLabel = labels["schemas_build_id"];
  if (!schemasBuildIdLabel) {
    console.error("`schemas_build_id` label is missing, can't update schema")
  }

  return schemasBuildIdLabel;
}

async function getLatestStoredSchemaTs() {
  try {
    const db = admin.firestore();
    const latestSchema = await db.collection('glean_schemas').doc('latest').get();
    if (!latestSchema.exists) {
      console.log('Latest glean schema doc not found in Firestore');
      return null;
    } else {
      return latestSchema.data().deployTimestamp;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function fetchGleanSchema(hash) {
  const schemaUrl = "https://raw.githubusercontent.com/mozilla-services/mozilla-pipeline-schemas/" +
    hash + "/schemas/glean/glean/glean.1.schema.json";
  return axios.get(schemaUrl)
    .then(response => JSON.stringify(response.data))
    .catch(error => console.error(error));
}

async function storeSchema(schema, schemaInfo) {
  const db = admin.firestore();
  const batch = db.batch();

  db.collection("glean_schemas");
  const latestSchemaRef = db.collection("glean_schemas").doc("latest");
  const byDateSchemaRef = db.collection("glean_schemas").doc(schemaInfo.timestamp);

  const schemaData = {
    deployTimestamp: schemaInfo.timestamp,
    commitHash: schemaInfo.hash,
    schema: schema,
    insertTs: Date.now(),
  };

  batch.set(latestSchemaRef, schemaData);
  batch.set(byDateSchemaRef, schemaData);

  return batch.commit();
}

exports.gleanSchemaLoader = functions.pubsub.schedule('*/15 * * * *').onRun(async (context) => {
  const latestStoredSchemaTs = await getLatestStoredSchemaTs();

  const schemasBuildIdLabel = await getGleanBuildIdLabel();
  const schemaInfo = extractSchemaInfo(schemasBuildIdLabel);

  const latestDeployedSchemaTs = schemaInfo.timestamp;
  console.log(`Latest schema timestamps:\nstored:   ${latestStoredSchemaTs}\ndeployed: ${latestDeployedSchemaTs}`);

  if (latestStoredSchemaTs !== latestDeployedSchemaTs) {
    console.log("Fetching new schema...");
    const gleanSchema = await fetchGleanSchema(schemaInfo.hash);

    return storeSchema(gleanSchema, schemaInfo)
      .then(_ => console.log("Done"))
      .catch(error => console.error(error));
  } else {
    console.log("Schema is up to date, nothing to do");
    return Promise.resolve();
  }
});

function extractSchemaInfo(schemasBuildIdLabel) {
  const split = schemasBuildIdLabel.split("_");
  return {hash: split[1], timestamp: split[0]};
}

exports.testables = {
  extractSchemaHash: extractSchemaInfo
}
