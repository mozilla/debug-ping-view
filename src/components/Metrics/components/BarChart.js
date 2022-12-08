import React from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

const BarChart = ({ title, data }) => {
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
        display: 'inline-block',
        marginLeft: 5,
        marginRight: 5
      }}
    />
  );
};

BarChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default BarChart;
