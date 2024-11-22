import React from 'react';
import InfoTextComponent from './InfoTextComponent';
const InfoBoxComponent = ({ info }) => {
  if (!info || Object.keys(info).length === 0) return null;
  const image = info.image;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',  
      overflow: 'hidden',       
      gap: "20px",
      alignItems: "center",
      padding: '20px',          
      border: '2px solid #ccc',  
      borderRadius: '8px',      
      backgroundColor: '#fff',  
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  
      maxWidth: '600px',        
      margin: '20px auto',      
      textAlign: 'center',      
    }}>
      {/* Image container */}
      <div style={{
        flex: '0 1 auto',  
        marginRight: '20px',
        maxHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', 
        alignItems: 'center',
      }}>
        <img
          src={image.url}
          alt={image.caption || 'Main visual'}
          style={{
            width: 'auto',    
            height: '100%',   
            objectFit: 'contain',  
          }}
        />
        <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#555' }}>
          {image.caption || 'Default caption'}
        </div>
      </div>
    
      {/* Info Text Component */}
      <div style={{ flex: 1, overflow: 'auto'}}>
        <InfoTextComponent info={info} />
      </div>
    </div>
    
  );
};

export default InfoBoxComponent;
