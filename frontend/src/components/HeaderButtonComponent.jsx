import React from 'react';

const HeaderButtonComponent = ({ fontsize, buttonText, onButtonClick }) => {
  return (
    <button
        onClick={onButtonClick}
        style={{
          background: 'none',
          border: 'none',
          color: 'black',
          textDecoration: 'underline',
          cursor: 'pointer',
          fontSize: fontsize,
          fontWeight: 'bold',
          padding: '0',
          marginBottom: '20px',
        }}
      >
        {buttonText}
      </button>
  );
};

export default HeaderButtonComponent;
