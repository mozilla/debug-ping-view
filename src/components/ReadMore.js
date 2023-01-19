import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const ReadMore = ({ numberOfLines = 3, text }) => {
  const [show, setShow] = useState(false);

  // Memoize this text replacement so it only happens once.
  const formattedText = useMemo(() => {
    let updatedText = text;

    // Add spaces so CSS can break JSON string into multiple lines.
    updatedText = updatedText.replace(/":"/g, '": "');
    updatedText = updatedText.replace(/","/g, '", "');

    return updatedText;
  }, [text]);

  return (
    <div className='cursor-pointer' onClick={() => setShow((prev) => !prev)}>
      <span
        style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          WebkitLineClamp: show ? 'unset' : numberOfLines,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical'
        }}
      >
        {formattedText}
      </span>
    </div>
  );
};

ReadMore.propTypes = {
  numberOfLines: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired
};

export default ReadMore;
