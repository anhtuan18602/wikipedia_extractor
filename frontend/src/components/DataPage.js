import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import QueryComponent from './QueryComponent';
import DataDisplayComponent from './DataDisplayComponent';

const DataPage = () => {
  const { query } = useParams(); 
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({}); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      
      setResult(null);
      setError(null);
      return;
    }

    
    if (cache[query]) {
      setResult(cache[query]); 
      setError(null);
    } else {
      
      const fetchData = async () => {
        try {
          const response = await axios.post('http://127.0.0.1:5000/api/query', { query });
          setResult(response.data);
          setError(null);

          
          setCache((prevCache) => ({ ...prevCache, [query]: response.data }));
        } catch (error) {
          setError("There was an error with the query.");
          setResult(null);
        }
      };

      fetchData();
    }
  }, [query, cache]); 

  const handleNewQuery = (newQuery) => {
    if (!newQuery.trim()) {
      setError("Please enter a valid query.");
      return;
    }
    setError(null);
    setResult(null);
    navigate(`/results/${newQuery}`); 
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: 'column',
      gap: '20px',
      border: 'none'
    }}>
    
      
    
      {/* Query Component */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',
        borderRadius: '8px',
      }}>
        <QueryComponent onSubmit={handleNewQuery} />
      </div>
    
      {/* Conditional Content */}
      {/* Error Message */}
      {error && (
        <p style={{
          color: 'red',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '10px',
          backgroundColor: '#ffdddd',
          borderRadius: '5px',
        }}>
          {error}
        </p>
      )}
    
      {/* Loading State */}
      {!result && !error && (
        <p style={{
          color: '#888',
          fontSize: '1.2rem',
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          {"Loading result..."}
        </p>
      )}
    
      {/* Data Display */}
      {result && (
        <DataDisplayComponent
          data={result}
          onListItemClick={handleNewQuery}
          style={{
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
      )}
    
      {/* Prompt to Enter Query */}
      {!query && !result && (
        <p style={{
          color: '#333',
          textAlign: 'center',
          fontSize: '1.2rem',
        }}>
          Enter a query to get started.
        </p>
      )}
    </div>
    
  );
};

export default DataPage;
