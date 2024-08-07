/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from 'react-router-dom';
import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore";

import { formatDate } from "../lib/date";
import ReturnToTop from "./ReturnToTop";
import Events from "./Events";

const EventStream = ({ debugId }) => {
  const { hash } = useLocation();

  /// state ///
  const [isFirstSnapshot, setIsFirstSnapshot] = useState(true);
  const [pings, setPings] = useState([]);
  const [changeQueue, setChangeQueue] = useState([]);

  /// lifecycle ///
  const onCollectionUpdate = useCallback(() => {
    // Clear previously highlighted entries on query update.
    let normalizedPings = pings.map((p) => {
      p.changed = false;
      return p;
    });

    // Iterate over all changes in change queue to add and/or remove pings.
    changeQueue.forEach((change) => {
      // New doc, need to append to current array.
      if (change.type === "added") {
        const { addedAt, payload, pingType, error, errorType, errorMessage, warning } =
          change.doc.data();

        // Add ping at the start of the array.
        normalizedPings.unshift({
          key: change.doc.id,
          addedAt,
          displayDate: formatDate(addedAt),
          payload,
          pingType,
          changed: true,
          error,
          errorType,
          errorMessage,
          warning
        });
      }

      // Doc should no longer be in our array, so we remove it.
      if (change.type === "removed") {
        normalizedPings = normalizedPings.filter((ping) => {
          // Remove all pings with corresponding ID, should only ever be 1.
          return ping.key !== change.doc.id;
        });
      }
    });

    // Sort the pings to show the most recent first.
    normalizedPings.sort((a, b) => {
      return a.addedAt > b.addedAt ? -1 : 1;
    });

    // Clear changed flag on page load to avoid whole table blinking.
    if (isFirstSnapshot) {
      normalizedPings.forEach((p) => {
        p.changed = false;
      });
    }

    setIsFirstSnapshot(false);
    setPings(normalizedPings);

    // Queued changes have been added to local pings; queue can be cleared.
    setChangeQueue([]);
  }, [pings, changeQueue, isFirstSnapshot]);

  useEffect(() => {
    const pingsQuery = query(
      collection(getFirestore(), "pings"),
      where("debugId", "==", debugId),
      orderBy("addedAt", "desc"),
      limit(100)
    );

    // Listener for our realtime connection to the firestore collection.
    const unsubscribe = onSnapshot(pingsQuery, (querySnapshot) => {
      setChangeQueue(querySnapshot.docChanges());
    });

    return () => {
      unsubscribe();
    };
  }, [debugId]);

  useEffect(() => {
    if (changeQueue.length) {
      // Process our queued changes.
      onCollectionUpdate();
    } else {
      // Do nothing, we have no currently queued changes.
    }
  }, [changeQueue, onCollectionUpdate]);

  const events = useMemo(() => {
    let allEvents = [];
    pings.forEach((ping) => {
      if (ping.payload) {
        try {
          const parsedPing = JSON.parse(ping.payload);
          const pingEvents = parsedPing.events;
  
          if (pingEvents) {
            pingEvents.forEach((pingEvent) => {
              let timestamp;
              if (pingEvent && pingEvent.extra && pingEvent.extra.glean_timestamp) {
                timestamp = pingEvent.extra.glean_timestamp;
              } else {
                const startTime = parsedPing.ping_info.start_time;
                const newDate = new Date(startTime);
                const dateAsMs = newDate.getTime();
                timestamp = dateAsMs + pingEvent.timestamp;
              }

              let sessionId;
              if (parsedPing && parsedPing.client_info && parsedPing.client_info.session_id) {
                sessionId = parsedPing.client_info.session_id;
              }
              allEvents.push({
                ...pingEvent,
                timestamp,
                sessionId
              });
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
    return allEvents;
  }, [pings]);

  /// render ///
  return (
    <div className='container-fluid m-2'>
      <ReturnToTop />
      {!!events && !!events.length && (
        <Events
          events={events}
          header={`Event Stream for ${debugId}`}
          isEventStream
          fragmentIdentifier={hash.replace('#', '')}
        />
      )}
      {!isFirstSnapshot && !events.length && <h3>No events recorded for this Debug Id.</h3>}
    </div>
  );
};

export default EventStream;
