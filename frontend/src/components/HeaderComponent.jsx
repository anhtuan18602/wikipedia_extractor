import React from 'react';

const HeaderComponent = ({ title }) => {
  return (
    
    <h1 style={{
        fontSize: '1.75rem',  
        fontWeight: 'bold',  
        color: '#333',  
        marginBottom: '10px',
        textDecoration:"underline"  
    }}>
      {title}
    </h1>
  );
};

export default HeaderComponent;
