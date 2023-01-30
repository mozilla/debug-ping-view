/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

async function deleteQueryBatch(db, query, numDeletedAcc = 0) {
  try {
    const snapshot = await query.get();
    if (snapshot.size === 0) {
      // When there are no documents left, we are done
      return numDeletedAcc;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    return await deleteQueryBatch(db, query, numDeletedAcc + snapshot.size);
  } catch (error) {
    console.log(error);
    return numDeletedAcc;
  }
}

/*
 * Deletes pings and clients older than `dateTo` in batches to allow for some progress in case of function timeout
 */
async function deleteOldPings(batchSize, dateTo) {
  const db = admin.firestore();

  const pingsQuery = db.collection('pings')
    .where('addedAt', '<', dateTo)
    .limit(batchSize);
  const clientsQuery = db.collection('clients')
    .where('lastActive', '<', dateTo)
    .limit(batchSize);

  const numDeletedPings = await deleteQueryBatch(db, pingsQuery);
  console.log("Deleted pings: " + numDeletedPings);
  const numDeletedClients = await deleteQueryBatch(db, clientsQuery);
  console.log("Deleted clients: " + numDeletedClients);
}

const runtimeOpts = {
  timeoutSeconds: 540,
}

/**
 * Removes old pings and inactive clients.
 *
 * Deletes pings and client entries updated earlier than 21 days before the calling event was scheduled.
 * Runs every day at 8:00 UTC
 */
exports.removeOutdatedPings = functions.runWith(runtimeOpts).pubsub.schedule('0 8 * * *')
  .timeZone('UTC')
  .onRun((context) => {
    let scheduleDate = new Date(context.timestamp);
    scheduleDate.setDate(scheduleDate.getDate() - 21);
    const deletionThresholdDate = scheduleDate.toISOString();
    console.log(`Triggered on: ${context.timestamp}, deleting documents older than: ${deletionThresholdDate}`);
    return deleteOldPings(100, deletionThresholdDate);
  });
