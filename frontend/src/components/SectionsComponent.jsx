import React, { useState } from 'react';
import TextComponent from './TextComponent';
import HeaderButtonComponent from './HeaderButtonComponent.jsx';

const SectionsComponent = ({ sections}) => {
  const [isExpanded, setIsExpanded] = useState(false); 
  const [expandedSections, setExpandedSections] = useState({}); 

  const toggleSectionVisibility = () => {
    setIsExpanded(!isExpanded); 
  };

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index], 
    }));
  };

  return (
    <div>
      {/* Button to expand/collapse the entire sections component */}
      <HeaderButtonComponent fontsize={'1.75rem'} buttonText={"Details"} onButtonClick={toggleSectionVisibility}/>
      

      {/* Show sections if the component is expanded */}
      {isExpanded && (
        <div>
          {sections.map((section, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              {/* Button to toggle visibility of each individual section */}
              <HeaderButtonComponent  fontsize={'1.35rem'} buttonText={`${index + 1}. ${section.title}`} onButtonClick={() => toggleSection(index) }/>
              

              {/* Show section content if it's expanded */}
              {expandedSections[index] && (
                <div>
                  <TextComponent text={section.text}/>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionsComponent;
