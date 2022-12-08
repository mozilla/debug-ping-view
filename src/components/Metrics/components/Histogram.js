import React from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

const Histogram = ({ title, data }) => {
  // Display nothing if we don't have distribution data.
  if (!data || !data.values) {
    return null;
  }

  // Create an array of all the keys respective to their counts.
  //
  // { 1: 1, 2: 1, 3: 2 } becomes [1, 2, 3, 3]
  const samples = [];
  Object.keys(data.values).forEach((key) => {
    for (let i = 0; i < data.values[key]; i++) {
      samples.push(Number(key));
    }
  });

  /// render ///
  return (
    <Plot
      data={[
        {
          x: samples,
          type: 'histogram'
        }
      ]}
      layout={{
        title,
        xaxis: {
          title: 'buckets'
        },
        yaxis: {
          title: 'count'
        }
      }}
      style={{
        display: 'inline-block',
        marginLeft: 5,
        marginRight: 5
      }}
    />
  );
};

Histogram.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default Histogram;
