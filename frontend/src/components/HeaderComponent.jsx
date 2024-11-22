import React from 'react';

const HeaderComponent = ({ title }) => {
  return (
    <header style={{
      backgroundColor: '#f4f4f4',  
      padding: '40px 20px',  
      textAlign: 'center',  
      borderRadius: '8px',  
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  
      marginBottom: '30px',  
    }}>
      <h1 style={{
        fontSize: '2.5rem',  
        fontWeight: 'bold',  
        color: '#333',  
        marginBottom: '10px',  
      }}>
        {title}
      </h1>
    </header>
  );
};

export default HeaderComponent;
