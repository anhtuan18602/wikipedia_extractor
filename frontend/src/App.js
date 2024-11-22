import React from 'react';
import { Routes, Route} from 'react-router-dom';
import DataPage from './components/DataPage';

function App() {




  return (
    <div style={{ 
      borderRadius: '8px',
      margin: '20px auto',
      fontFamily: "'Arial', sans-serif",
      padding: "40px"
    }}>
      <Routes>
        <Route path="/" element={<DataPage/>} />
        <Route path="/results/:query" element={<DataPage />} />
      </Routes>
    </div>
  );
}

export default App;
