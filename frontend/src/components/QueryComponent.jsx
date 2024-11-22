import React, { useState } from 'react';

function QueryComponent({ onSubmit }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(query); 
  };

  return (
    <div style={{ 
      gap: '20px', 
      borderRadius: '8px', 
      padding: '20px', 
      backgroundColor: '#f9f9f9', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      maxWidth: '1000px',
      textAlign: 'center', // Align text to the left
    }}>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query"
          style={{
            width: '70%',  // Input takes up 80% of the width
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem',
            marginRight: '10px',  // Space between input and button
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'border-color 0.3s'
          }}
        />
        
        <button 
          type="submit"
          style={{
            width: '30%',  // Button takes up 20% of the width
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f4f4f4',
            color: '#333',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s, border-color 0.3s',
            fontWeight: '500',
            textAlign: 'center',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#e1e1e1'; // Lighter grey on hover
            e.target.style.borderColor = '#999'; // Slightly darker border on hover
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#f4f4f4'; // Reset to original color
            e.target.style.borderColor = '#ccc'; // Reset to original border color
          }}
        >
          Submit
        </button>
      </form>
    </div>
    
    
    
  );
}

export default QueryComponent;
