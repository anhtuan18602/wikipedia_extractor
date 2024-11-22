import React from 'react';


const KEY_FLEX = 1; 
const VALUE_FLEX = 2; 

const InfoTextComponent = ({ info }) => {
  if (!info || Object.keys(info).length === 0) return null;

  
  const excludedKeys = ['image', 'birth_date', 'death_date', 'birth_death', 'Name', "Birth Place"];

  return (
    <div
      style={{
        flex: '1', 
        display: 'flex',
        flexDirection: 'column', 
        justifyContent: 'flex-end', 
        padding: '10px',
        overflow: 'auto', 
      }}
    >
      <h1>{info["Full Name"] ? info["Full Name"] : info["Name"]}</h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column', 
          gap: '10px', 
          padding: '0',
        }}
      >
        {/* Handling "Born" and "Death" sections with line breaks for place */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row', 
            gap: '10px',
          }}
        >
          <div
            style={{
              flex: KEY_FLEX,
              fontWeight: 'bold',
              textAlign: 'left',
            }}
          >
            {"Born:"}
          </div>
          <div
            style={{
              flex: VALUE_FLEX,
              textAlign: 'left',
            }}
          >
            {info.birth_date}
            {info["Birth Place"] && <><br />{info["Birth Place"]}</>}
          </div>
        </div>

        {info.death_date && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row', 
              gap: '10px',
            }}
          >
            <div
              style={{
                flex: KEY_FLEX,
                fontWeight: 'bold',
                textAlign: 'left',
              }}
            >
              {"Died:"}
            </div>
            <div
              style={{
                flex: VALUE_FLEX,
                textAlign: 'left',
              }}
            >
              {info.death_date}
              {info["Death Place"] && <><br />{info["Death Place"]}</>}
            </div>
          </div>
        )}

        {/* Loop through the rest of the info object and display each key-value pair */}
        {Object.entries(info).map(([key, value]) => {
          if (excludedKeys.includes(key)) {
            return null; 
          }
          if (key === "signature") {
            return (
                <img
                    src={value.url}
                    alt={value.caption || 'Main visual'}
                    style={{
                        width: 'auto',    
                        height: '100%',   
                        objectFit: 'contain',  
                    }}
                />
            )
          }
          return (
            <div
              key={key}
              style={{
                display: 'flex',
                flexDirection: 'row', 
                gap: '10px',
              }}
            >
              <div
                style={{
                  flex: KEY_FLEX, 
                  fontWeight: 'bold',
                  textAlign: 'left',
                }}
              >
                {key}:
              </div>
              <div
                style={{
                  flex: VALUE_FLEX, 
                  textAlign: 'left',
                }}
              >
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InfoTextComponent;
