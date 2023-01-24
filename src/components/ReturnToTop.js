import React, { useState } from 'react';

const ReturnToTop = () => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 500) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };
  window.addEventListener('scroll', toggleVisible);

  return (
    <button
      className='return-to-top btn btn-sm btn-outline-secondary'
      style={{ display: visible ? 'block' : 'none' }}
      onClick={() => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }}
    >
      Back to top
    </button>
  );
};

export default ReturnToTop;
