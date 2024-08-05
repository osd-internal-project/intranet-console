import React from 'react';
import ReactDOM from 'react-dom';
import PdfViewer from "../components/PDFloader";

const App: React.FC = () => {
  return (
    <div>
      <h1>PDF Viewer</h1>
      <PdfViewer />
    </div>
  );
};document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(<App />, document.getElementById('root'));
});
export default App;