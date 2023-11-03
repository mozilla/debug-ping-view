/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import React from "react";
import PropTypes from "prop-types";

const Dropdown = ({ name, defaultValue, state, setState, values }) => {
  /// handlers ///
  const handleOnSelect = (event) => {
    setState(event.target.value);
  };

  const handleClearFilter = () => {
    setState("");
  };

  /// render //
  const shouldSelectBeDisabled = !values || values.length === 0;
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <select
        // We have no values, so no reason for enabling the select.
        disabled={shouldSelectBeDisabled}
        name={name}
        onChange={handleOnSelect}
        value={state}
        style={{ marginBottom: "4px" }}
      >
        <option value='' disabled>
          {defaultValue}
        </option>
        {values.map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>
      {/* Only show the clear button if they've selected something already. */}
      {!!state && (
        <button className='btn' onClick={handleClearFilter}>
          <strong>X</strong>
        </button>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired
};

export default Dropdown;
