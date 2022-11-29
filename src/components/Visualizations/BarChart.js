import React from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

const BarChart = ({ title, data }) => {
  /// render ///
  return (
    <Plot
      data={[
        {
          x: Object.keys(data),
          y: Object.values(data),
          type: 'bar'
        }
      ]}
      layout={{
        title
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

BarChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default BarChart;
