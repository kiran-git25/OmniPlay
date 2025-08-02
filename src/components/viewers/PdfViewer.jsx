import React from 'react';

function PdfViewer({ file }) {
  const url = URL.createObjectURL(file);
  return (
    <iframe
      src={url}
      title="PDF Viewer"
      width="100%"
      height="600px"
      style={{ border: 'none' }}
    />
  );
}

export default PdfViewer;
