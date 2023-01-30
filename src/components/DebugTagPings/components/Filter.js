/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import FilterDropdown from './FilterDropdown';
import SearchBar from '../../SearchBar';

import { aggregatePingTypes, filterOnPingType } from '../lib/filter/pingType';
import { aggregateMetricTypes, filterOnMetricType } from '../lib/filter/metricType';
import { aggregateMetricIds, filterOnMetricId } from '../lib/filter/metricId';
import { searchArrayElementPropertiesForSubstring } from '../../../lib/searchArrayElementPropertiesForSubstring';

const Filter = ({ pings, handleFilter, handleFiltersApplied }) => {
  // This ref is used to invoke a function exposed from a child component.
  const searchRef = useRef();

  /// state ///
  const [showOptions, setShowOptions] = useState(false);

  // Search
  const [search, setSearch] = useState('');

  // Filter
  const [pingType, setPingType] = useState('');
  const [metricType, setMetricType] = useState('');
  const [metricId, setMetricId] = useState('');

  /// handlers ///
  const hideFilters = () => {
    setShowOptions(false);
  };

  const clearFilters = () => {
    // Call the `clearInput` function from the `SearchBar` child component
    // so that we can update the local state to ensure our search is
    // properly cleared out.
    if (searchRef.current && searchRef.current.clearInput) {
      searchRef.current.clearInput();
    }

    setPingType('');
    setMetricType('');
    setMetricId('');
  };

  const handleToggleRenderOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const areAnyFiltersApplied = !!search || !!pingType || !!metricType || !!metricId;

  /// lifecycle ///
  useEffect(() => {
    let filteredPings = pings;

    // Update list of pings that match search.
    filteredPings = searchArrayElementPropertiesForSubstring(
      filteredPings, // Full list of pings to search.
      search.toLowerCase().trim(), // Query trimmed and converted to lowercase.
      ['pingType', 'payload'] // All ping properties to search.
    );

    // Check all options for filters. If the filter value is empty, all the
    // pings will be returned; each function has a guard clause for this.
    filteredPings = filterOnPingType(filteredPings, pingType);
    filteredPings = filterOnMetricType(filteredPings, metricType);
    filteredPings = filterOnMetricId(filteredPings, metricId);

    // Pass new set of filtered pings back to up to the parent component.
    handleFilter(filteredPings);

    // Tell the parent component whether or not any filters are currently
    // applied.
    handleFiltersApplied(areAnyFiltersApplied);

    // This is ok to be disabled. The exhaustive dependency eslint rule is more
    // of a nuisance than anything else. If we add all required dependencies
    // then React will infinitely re-render. We only want to trigger re-renders
    // whenever one of our filter options update.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pings, search, pingType, metricType, metricId]);

  /// render ///
  const pingTypes = aggregatePingTypes(pings);
  const metricTypes = aggregateMetricTypes(pings);
  const metricIds = aggregateMetricIds(pings);

  return (
    <div style={{ marginBottom: '8px' }}>
      <SearchBar
        onInput={(input) => setSearch(input)}
        placeholder='Search'
        inputStyles={{ width: '20%' }}
        debounceTime={500}
        ref={searchRef}
      />
      {!showOptions && (
        <button
          type='button'
          onClick={handleToggleRenderOptions}
          className='btn btn-sm btn-outline-secondary'
        >
          Add Filters
        </button>
      )}
      {showOptions && (
        <div>
          {/* Ping Type */}
          {!!pingTypes.length && (
            <FilterDropdown
              name='pingType'
              defaultValue='Ping Type'
              state={pingType}
              setState={setPingType}
              values={pingTypes}
            />
          )}
          {/* Metric Type */}
          {!!metricTypes.length && (
            <FilterDropdown
              name='metricType'
              defaultValue='Metric Type'
              state={metricType}
              setState={setMetricType}
              values={metricTypes}
            />
          )}
          {/* Metric ID */}
          {!!metricIds.length && (
            <FilterDropdown
              name='metricId'
              defaultValue='Metric ID'
              state={metricId}
              setState={setMetricId}
              values={metricIds}
            />
          )}
          {/* Clear Filters */}
          <div>
            <button
              className='btn btn-sm btn-outline-secondary'
              style={{ marginTop: '10px' }}
              onClick={areAnyFiltersApplied ? clearFilters : hideFilters}
            >
              {areAnyFiltersApplied ? 'Clear All Filters' : 'Hide Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Filter.propTypes = {
  pings: PropTypes.arrayOf(PropTypes.object),
  handleFilter: PropTypes.func,
  handleFiltersApplied: PropTypes.func
};

export default Filter;
