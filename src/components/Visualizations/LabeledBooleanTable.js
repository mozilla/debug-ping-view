import React from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

const LabeledBooleanTable = ({ title, data }) => {
  // Display nothing if we don't have data.
  if (!data) {
    return null;
  }

  const values = [Object.keys(data), Object.values(data)];
  return (
    <Plot
      data={[
        {
          type: 'table',
          header: {
            values: [['<b>KEY</b>'], ['<b>VALUE</b>']],
            align: ['left']
          },

          cells: {
            values: values,
            align: ['left']
          }
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

LabeledBooleanTable.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default LabeledBooleanTable;
