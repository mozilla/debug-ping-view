/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import useWindowDimensions from '../../../lib/useWindowDimensions';

const Timeline = ({ events, plotClickHandler }) => {
  const { width } = useWindowDimensions();

  const onClickHandler = (clickEvent) => {
    let eventName;
    let timestamp;

    for (var i = 0; i < clickEvent.points.length; i++) {
      eventName = clickEvent.points[i].y;
      timestamp = clickEvent.points[i].x;
    }

    plotClickHandler(eventName, timestamp);
  };

  /// render ///
  return (
    <>
      <Plot
        data={[
          {
            x: events.map((event) => event.timestamp),
            y: events.map((event) => `${event.category}.${event.name}`),
            hovertemplate: '%{y}, %{x} (ms)<extra></extra>',
            type: 'scatter',
            mode: 'markers',
            marker: {
              line: {
                width: 1
              },
              symbol: 'circle',
              size: 12
            }
          }
        ]}
        layout={{
          width: width - 50,
          title: 'Events',
          xaxis: {
            title: 'Timestamp (ms)',
            showgrid: false,
            showline: true,
            autotick: true,
            ticks: 'outside',
            tickformat: '%{n}'
          },
          yaxis: {
            automargin: true,
            autorange: 'reversed'
          }
        }}
        onClick={onClickHandler}
      />
    </>
  );
};

Timeline.propTypes = {
  events: PropTypes.array.isRequired
};

export default Timeline;
