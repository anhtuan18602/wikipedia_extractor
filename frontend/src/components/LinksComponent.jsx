import React from 'react';

const LinksComponent = ({ links, onItemClick }) => {
  if (!links || Object.keys(links).length === 0) {
    return <p>No categories available.</p>;
  }

  return (
    <div>
      {Object.keys(links).map((category, index) => {
        if (links[category].length === 0) return null;

        return (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h3>{category}</h3>
          <ul>
            {links[category].map((item, idx) => (
              <li key={idx}>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'blue',
                    fontSize: '1rem',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={() => onItemClick(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
        );
      })}
    </div>
  );
};

export default LinksComponent;
