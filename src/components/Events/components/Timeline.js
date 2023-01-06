/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import useWindowDimensions from '../../../lib/useWindowDimensions';

const Timeline = ({ events }) => {
  const { width } = useWindowDimensions();

  /// render ///
  return (
    <>
      <Plot
        data={[
          {
            x: events.map((event) => event.timestamp),
            y: events.map((event) => `${event.category}.${event.name}`),
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
            title: 'Timestamp',
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
      />
    </>
  );
};

Timeline.propTypes = {
  events: PropTypes.array.isRequired
};

export default Timeline;
