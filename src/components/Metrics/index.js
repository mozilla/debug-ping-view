import React from 'react';
import PropTypes from 'prop-types';

import BarChart from './components/BarChart';
import Histogram from './components/Histogram';
import MetricValuesTable from './components/MetricValuesTable';

const Metrics = ({ metrics }) => {
  /// helpers ///
  /**
   * Render the correct visualization for each metric type. Most metrics use
   * the default case of the switch which is just a flattened table or group
   * of tables.
   *
   * @param {string} metricKey A Glean metric type (timespan, boolean, etc).
   * @returns {JSX.Element} A visualization for the respective metric.
   */
  const renderMetric = (metricKey) => {
    const metricData = metrics[metricKey];

    if (!metricData) {
      return null;
    }

    let content;
    switch (metricKey) {
      case 'timing_distribution':
      case 'memory_distribution':
      case 'custom_distribution':
        content = Object.keys(metricData).map((key, i) => (
          <Histogram key={`${key}${i}`} title={key} data={metricData[key]} />
        ));
        break;
      case 'labeled_counter':
        content = Object.keys(metricData).map((key, i) => (
          <BarChart key={`${key}${i}`} title={key} data={metricData[key]} />
        ));
        break;
      default:
        content = <MetricValuesTable metricData={metricData} />;
        break;
    }

    return (
      <details key={metricKey}>
        <summary>
          <p>
            <strong>{metricKey}</strong>
          </p>
        </summary>
        {content}
      </details>
    );
  };

  /// render ///
  return (
    <div>
      <h4>metrics</h4>
      {Object.keys(metrics).map(renderMetric)}
    </div>
  );
};

Metrics.propTypes = {
  metrics: PropTypes.object.isRequired
};

export default Metrics;
