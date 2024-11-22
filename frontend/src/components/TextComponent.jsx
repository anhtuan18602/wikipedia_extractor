import React from 'react';

const TextComponent = ({ text}) => {
  
    return (
      <p style={{
        fontSize: '1.1rem',  
        lineHeight: '1.8',  
        color: '#333',  
        marginBottom: '20px',  
        letterSpacing: '0.5px',  
        textAlign: 'justify',  
      }}>  
        {text}
      </p>
    );
  };
  
  export default TextComponent;
