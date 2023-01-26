/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

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
