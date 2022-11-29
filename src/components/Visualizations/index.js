import React from 'react';
import PropTypes from 'prop-types';

import BarChart from './BarChart';
import Histogram from './Histogram';
import LabeledBooleanTable from './LabeledBooleanTable';

import { visualizationMetrics } from '../ShowRawPing/lib/constants';

const Visualizations = ({ metrics }) => {
  /**
   * Single entry point for rendering visualizations. There needs to be a switch
   * case for every metric that we support visualizations for.
   *
   * @param {string} metric A Glean metric type.
   * @param {string} title The title to display on the chart.
   * @returns {JSX.Element | null} The respective visualization or null.
   */
  const renderVisualization = (metric, title) => {
    // If the metric doesn't exist on the metrics object, then we cannot
    // display anything.
    if (!metrics[metric]) {
      return null;
    }

    let visualizations;
    switch (metric) {
      case 'timing_distribution':
      case 'memory_distribution':
      case 'custom_distribution': {
        visualizations = Object.keys(metrics[metric]).map((key, i) => (
          <Histogram key={`${key}${i}`} title={key} data={metrics[metric][key]} />
        ));
        break;
      }

      case 'labeled_counter': {
        visualizations = Object.keys(metrics[metric]).map((key, i) => (
          <BarChart key={`${key}${i}`} title={key} data={metrics[metric][key]} />
        ));
        break;
      }

      case 'labeled_boolean': {
        visualizations = Object.keys(metrics[metric]).map((key, i) => (
          <LabeledBooleanTable key={`${key}${i}`} title={key} data={metrics[metric][key]} />
        ));
        break;
      }

      default:
        break;
    }

    // We don't support this metric type, we cannot display anything.
    if (!visualizations) {
      return null;
    }

    return (
      <details>
        <summary>
          <h5>{title}</h5>
        </summary>
        {visualizations}
      </details>
    );
  };

  return (
    <>
      <h4>Metric Visualizations</h4>
      <p>
        Currently supported metrics with visualizations:{' '}
        {visualizationMetrics.map((metric, idx) => (
          <strong>
            <i>{`${metric}${idx === visualizationMetrics.length - 1 ? '.' : ', '}`}</i>
          </strong>
        ))}
      </p>

      {/* Distribution Metrics: Timing, Memory, Custom */}
      {renderVisualization('timing_distribution', 'Timing Distributions')}
      {renderVisualization('memory_distribution', 'Memory Distributions')}
      {renderVisualization('custom_distribution', 'Custom Distributions')}

      {/* Labeled Metrics: Booleans, Counters */}
      {renderVisualization('labeled_counter', 'Labeled Counters')}
      {renderVisualization('labeled_boolean', 'Labeled Booleans')}

      <br />
    </>
  );
};

Visualizations.propTypes = {
  metrics: PropTypes.object
};

export default Visualizations;
