import React from 'react';
import PropTypes from 'prop-types';

import { flattenJson } from '../../../lib/flattenJson';

const MetricValuesTable = ({ metricData }) => {
  /// helpers ///
  const hasNestedValues = (obj) => {
    return Object.values(obj).some((value) => typeof value === 'object');
  };

  const renderKvpTable = (data) => {
    return (
      <table className='mzp-u-data-table' key={JSON.stringify(data)}>
        <thead>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map((key) => {
            let value = data[key];

            // Have to convert booleans to strings or else nothing
            // is printed in the table.
            if (typeof value === 'boolean') {
              value = value.toString();
            }

            return (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  /// render ///
  if (!hasNestedValues(metricData)) {
    return renderKvpTable(metricData);
  }

  return (
    <>
      {Object.keys(metricData).map((objKey) => {
        // Flatten object so we can print everything.
        const data = flattenJson(metricData[objKey]);
        return (
          <React.Fragment key={objKey}>
            <p>{objKey}</p>
            {renderKvpTable(data)}
          </React.Fragment>
        );
      })}
    </>
  );
};

MetricValuesTable.propTypes = {
  metricData: PropTypes.object.isRequired
};

export default MetricValuesTable;
