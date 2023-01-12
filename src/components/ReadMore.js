import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ReadMore = ({ numberOfLines = 3, text }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={() => setShow((prev) => !prev)} className='btn btn-sm btn-outline-secondary'>
        {show ? 'collapse' : 'expand'}
      </button>
      <div
        style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          WebkitLineClamp: show ? 'unset' : numberOfLines,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical'
        }}
      >
        {text}
      </div>
    </div>
  );
};

ReadMore.propTypes = {
  numberOfLines: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired
};

export default ReadMore;
