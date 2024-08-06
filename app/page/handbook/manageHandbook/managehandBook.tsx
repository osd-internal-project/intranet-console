import React from 'react';
import ReactDOM from 'react-dom';
import PdfViewer from "../components/PDFloader";

const Managehandbook: React.FC = () => {
  return (
    <div>
      <h1>นำไฟล์ Portable Document Format (PDF) </h1>
      <PdfViewer />
    </div>
  );
};document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(<Managehandbook />, document.getElementById('root'));
});
export default Managehandbook;