import React, { useState } from 'react';

const HtmlEditor = () => {
  const [inputText, setInputText] = useState<string>('');
  const [htmlOutput, setHtmlOutput] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const convertToHtml = () => {
    setHtmlOutput(inputText);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>HTML Text Editor</h1>
      <textarea
        style={{ width: '100%', height: '100px', marginBottom: '20px' }}
        value={inputText}
        onChange={handleInputChange}
      ></textarea>
      <br />
      <button onClick={convertToHtml}>Convert to HTML</button>
      <h3>HTML Output:</h3>
      <div
        style={{
          border: '1px solid #ddd',
          padding: '10px',
          marginTop: '20px',
        }}
        dangerouslySetInnerHTML={{ __html: htmlOutput }}
      ></div>
    </div>
  );
};

export default HtmlEditor;
