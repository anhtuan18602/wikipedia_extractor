import React, { useState } from 'react';

function QueryComponent({ onSubmit }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(query); 
  };

  return (
    <div style={{ gap: '20px', borderRadius: '8px' }}>
      <h2>Enter Your Query</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default QueryComponent;
