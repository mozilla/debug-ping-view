/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { React, useState } from 'react';
import PropTypes from 'prop-types';

import BarChart from './components/BarChart';
import Histogram from './components/Histogram';
import MetricValuesTable from './components/MetricValuesTable';

// A given "metrics" ping may have hundreds of plotable metrics.
// That's too many to render quickly, so fall back to the quick
// MetricsValueTable if we have "too many".
// ("too many" defined here as "whatever seemed right at the time").
const MAX_DIST_PLOTS = 50;
const MAX_LABELED_COUNTER_PLOTS = 50;

const Metrics = ({ metrics }) => {
  /// handlers ///
  const [showAnyway, setShowAnyway] = useState(false);

  const handleShowAnyway = () => {
    setShowAnyway(true);
  }

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

    let content, advisory;
    switch (metricKey) {
      case 'timing_distribution':
      case 'memory_distribution':
      case 'custom_distribution':
        if (!showAnyway && Object.keys(metricData).length > MAX_DIST_PLOTS) {
          advisory = (
            <p>
              <strong>Advisory: </strong>&nbsp;
              The number of {metricKey} metrics is more than the threshold
              for rich plot display ({Object.keys(metricData).length} / {MAX_DIST_PLOTS}).
              Raw metric values table display is being used instead.
              <br/>
              <button className='btn btn-sm btn-outline-secondary' onClick={handleShowAnyway}>
                Render all rich plots anyway (may take tens of seconds)
              </button>
            </p>
          );
          content = <MetricValuesTable metricData={metricData} />;
        } else {
          content = Object.keys(metricData).sort().map((key, i) => (
            <Histogram key={`${key}${i}`} title={key} data={metricData[key]} />
          ));
        }
        break;
      case 'labeled_counter':
        if (!showAnyway && Object.keys(metricData).length > MAX_LABELED_COUNTER_PLOTS) {
          advisory = (
            <p>
              <strong>Advisory: </strong>&nbsp;
              The number of {metricKey} metrics is more than the threshold
              for rich plot display ({Object.keys(metricData).length} / {MAX_LABELED_COUNTER_PLOTS}).
              Raw metric values table display is being used instead.
              <br/>
              <button className='btn btn-sm btn-outline-secondary' onClick={handleShowAnyway}>
                Render all rich plots anyway (may take tens of seconds)
              </button>
            </p>
          );
          content = <MetricValuesTable metricData={metricData} />;
        } else {
          content = Object.keys(metricData).sort().map((key, i) => (
            <BarChart key={`${key}${i}`} title={key} data={metricData[key]} />
          ));
        }
        break;
      default:
        content = <MetricValuesTable metricData={metricData} />;
        break;
    }

    return (
      <div key={metricKey}>
        <p>
          <strong>{metricKey}</strong>
        </p>
        {advisory}
        {content}
      </div>
    );
  };

  /// render ///
  return (
    <div>
      <h4>metrics</h4>
      {Object.keys(metrics).sort().map(renderMetric)}
    </div>
  );
};

Metrics.propTypes = {
  metrics: PropTypes.object.isRequired
};

export default Metrics;
