import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from '../lib/useDebounce';

const SearchBar = forwardRef(
  (
    {
      onInput, // Required - Runs each time user enters a character.
      containerStyles, // Optional - Styles for the outer div.
      inputStyles, // Optional - Styles for the input element.
      placeholder, // Optional - Placeholder for the input element.
      debounceTime, // Optional - Amount of delay required before firing `onInput`.
      tooltipContent // Optional - Text to display in the tooltip.
    },
    ref
  ) => {
    /// state ///
    const [search, setSearch] = useState('');
    const debouncedSearchTerm = useDebounce(search, debounceTime || 0);

    // Allows us to clear the input field from the parent component, where the
    // event for clearing all filters fires.
    useImperativeHandle(ref, () => ({
      clearInput: () => {
        setSearch('');
      }
    }));

    /// lifecycle ///
    useEffect(() => {
      onInput(debouncedSearchTerm);
    }, [debouncedSearchTerm, onInput]);

    /// handlers ///
    const handleInput = (event) => {
      setSearch(event.target.value);
    };

    /// render ///
    return (
      <div style={containerStyles}>
        <input
          value={search}
          style={{ ...inputStyles, marginRight: '5px' }}
          type='text'
          onInput={handleInput}
          placeholder={placeholder}
          autoFocus
        />
        {!!tooltipContent && (
          <i
            className='fa fa-info-circle'
            data-toggle='tooltip'
            data-placement='top'
            title={tooltipContent}
          />
        )}
      </div>
    );
  }
);

SearchBar.propTypes = {
  onInput: PropTypes.func.isRequired,
  debounceTime: PropTypes.number,
  containerStyles: PropTypes.object,
  inputStyles: PropTypes.object,
  placeholder: PropTypes.string,
  tooltipContent: PropTypes.string
};

export default SearchBar;
