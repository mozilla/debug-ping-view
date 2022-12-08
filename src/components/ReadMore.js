import React from 'react';
import ShowMoreText from 'react-show-more-text';
import PropTypes from 'prop-types';

const ReadMore = ({ lines, less, more, children }) => {
  return (
    <div>
      <ShowMoreText
        lines={lines}
        more={more}
        less={less}
        truncatedEndingComponent={'…'}
        anchorClass='btn btn-sm btn-outline-secondary'
      >
        {children}
      </ShowMoreText>
    </div>
  );
};

ReadMore.defaultProps = {
  lines: 3,
  more: 'expand',
  less: 'collapse'
};

ReadMore.propTypes = {
  lines: PropTypes.number.isRequired,
  less: PropTypes.string,
  more: PropTypes.string
};

export default ReadMore;
