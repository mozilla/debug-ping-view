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
  const valuesInHistogram = [];
  Object.keys(data.values).forEach((key) => {
    for (let i = 0; i < data.values[key]; i++) {
      valuesInHistogram.push(Number(key));
    }
  });

  /// render ///
  return (
    <Plot
      data={[
        {
          x: valuesInHistogram,
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
        width: '49%',
        display: 'inline-block',
        marginLeft: '5px',
        marginRight: '5px'
      }}
    />
  );
};

Histogram.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default Histogram;
