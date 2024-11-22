import React from 'react';
import LinksComponent from './LinksComponent';
import InfoBoxComponent from './InfoBoxComponent';
import SummaryComponent from './SummaryComponent';
import SectionsComponent from './SectionsComponent';

const DataDisplayComponent = ({ data , onListItemClick}) => {
    if (!data) return <div></div>;
    console.log(data)
    
  
    return (
      <div style={{ gap: '20px', borderRadius: '8px' }}>
        <div style={{ display: "flex", gap: '20px', borderRadius: '8px', maxWidth: '100%', }}>
          <div style={{ flex: 3}}>
            <SummaryComponent summary={data.page.summary} links={data.page.links}/>
            <LinksComponent links={data.page.links_dict} onItemClick={onListItemClick} />
            <SectionsComponent sections={data.page.sections} />
          </div>
          <div style={{ flex: 1, display:"flex", flexDirection: 'column', alignItems: 'flex-start'}}>
            <InfoBoxComponent info={data.infobox} />
          </div>
          
        </div>
        
        
        
      </div>
    );
  };
  
  export default DataDisplayComponent;
