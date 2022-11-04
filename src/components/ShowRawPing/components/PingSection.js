import React from 'react';
import PropTypes from 'prop-types';

import { flattenJson, getNestedAndNonNestedKeysFromObject } from '../lib/helpers';

const PingSection = ({ pingSection, header, isNested }) => {
  // If the component was called recursively (isNested), then we show a smaller
  // title so that we can display all items in the correct visual hierarchy.
  const renderTitle = () => {
    return (
      <a href={`#${header}`}>
        {isNested ? <h4 id={header}>{header}</h4> : <h3 id={header}>{header}</h3>}
      </a>
    );
  };

  // If the `pingSection` contains nested data, we recursively render this
  // component. If the `pingSection` does not contain nested data, then we
  // render all the KVPs in an html table. We flatten the nested objects
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
            <tbody>
              {nonNestedKeys.map((key) => {
                return (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{pingSection[key] || 'null'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!!nestedKeys.length &&
          nestedKeys.map((key) => {
            // Flatten all data for nested objects so that instead of multiple
            // nested tables, all values are in the same table and the keys
            // maintain correct hierarchical ordering.
            //
            // Reference the example in the JSDoc of `flattenJson` for more info.
            const flattenedPingSection = flattenJson(pingSection[key]);

            return (
              <PingSection key={key} pingSection={flattenedPingSection} header={key} isNested />
            );
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
