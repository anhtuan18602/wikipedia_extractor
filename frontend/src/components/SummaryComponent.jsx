import React from 'react';
import TextComponent from './TextComponent';
import HeaderComponent from './HeaderComponent';

const SummaryComponent = ({ summary, links }) => {
  if (!summary) return null;
  const parseTextWithLinks = (text, wordList) => {
    // Iterate over each phrase in the wordList
    let parsedText = text;
  
    wordList.forEach((phrase) => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi'); // Match the phrase globally and case-insensitively
      const baseUrl = window.location.origin; // Get the base URL (e.g., localhost:3000 or production URL)
  
      // Replace each occurrence of the phrase with a link
      parsedText = parsedText.replace(regex, (match) => {
        return `<a href="${baseUrl}/results/${match}" target="_blank" style="color: blue; text-decoration: underline;">${match}</a>`;
      });
    });
  
    return <span dangerouslySetInnerHTML={{ __html: parsedText }} />;
  };
  const parsedText = parseTextWithLinks(summary, links);
  return (
    <div style={{ marginBottom: '20px', display: "flex",flexDirection:"column" }}>
      <HeaderComponent title={"Summary"}/>
      <TextComponent text={parsedText}/>
    </div>
  );
};

export default SummaryComponent;
