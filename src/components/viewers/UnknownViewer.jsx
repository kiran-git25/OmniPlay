import React from 'react';

function UnknownViewer({ file }) {
  return <div>Unsupported file type: {file.name}</div>;
}

export default UnknownViewer;
