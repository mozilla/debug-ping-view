/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { flattenJson } from '../../../lib/flattenJson';
import { getNestedAndNonNestedKeysFromObject } from '../lib';

const PingSection = ({ pingSection, header, isNested }) => {
  // If the component was called recursively (isNested), then we show a smaller
  // title so that we can display all items in the correct visual hierarchy.
  const renderTitle = () => {
    return isNested ? <h4 id={header}>{header}</h4> : <h3 id={header}>{header}</h3>;
  };

  // If the `pingSection` contains nested data, we recursively render this
  // component. If the `pingSection` does not contain nested data, then we
  // render all the metric data in an html table. We flatten the nested objects
  // before they are displayed.
  const renderTable = () => {
    const { nestedKeys, nonNestedKeys } = getNestedAndNonNestedKeysFromObject(pingSection);

    if (!nonNestedKeys.length && !nestedKeys.length) {
      return <p>This object has no properties.</p>;
    }

    return (
      <>
        {!!nonNestedKeys.length && (
          <table className='mzp-u-data-table'>
            <thead>
              <tr>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {nonNestedKeys.map((key) => {
                let value = pingSection[key];

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
        )}
        {!!nestedKeys.length &&
          nestedKeys.map((key) => {
            const sectionData = pingSection[key];

            // This allows us to add a custom render for certain sections.
            switch (key) {
              // `events` and `metrics` have their own components that are rendered
              // in the `ShowRawPing` component, so we can ignore them here.
              case 'events':
              case 'metrics':
                return null;
              default:
                // Flatten all data for nested objects so that instead of multiple
                // nested tables, all values are in the same table and the keys
                // maintain correct hierarchical ordering.
                //
                // Reference the example in the JSDoc of `flattenJson` for more info.
                const flattenedPingSection = flattenJson(sectionData);

                return (
                  <PingSection key={key} pingSection={flattenedPingSection} header={key} isNested />
                );
            }
          })}
      </>
    );
  };

  return (
    <>
      {renderTitle()}
      {renderTable()}
    </>
  );
};

PingSection.propTypes = {
  pingSection: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  header: PropTypes.string.isRequired,
  isNested: PropTypes.bool
};

export default PingSection;
