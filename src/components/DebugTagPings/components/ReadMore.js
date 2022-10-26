import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ReadMore = ({ text, charLimit, less, more, containerStyle }) => {
  /// state ///
  const [expanded, setExpanded] = useState(false);

  /// handlers ///
  const toggleLines = (event) => {
    event.preventDefault();
    setExpanded((prev) => !prev);
  };

  /// render ///
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <p className={containerStyle}>{expanded ? text : text.slice(0, charLimit) + '…'}</p>
      <span>
        {' '}
        <button type='button' className='btn btn-sm btn-outline-secondary' onClick={toggleLines}>
          {expanded ? less : more}
        </button>
      </span>
    </div>
  );
};

ReadMore.defaultProps = {
  charLimit: 100,
  more: 'expand',
  less: 'collapse'
};

ReadMore.propTypes = {
  text: PropTypes.string.isRequired,
  charLimit: PropTypes.number,
  less: PropTypes.string,
  more: PropTypes.string,
  containerStyle: PropTypes.string
};

export default ReadMore;
