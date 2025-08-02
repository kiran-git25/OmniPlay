import React from 'react';

function ImageViewer({ file }) {
  const url = URL.createObjectURL(file);
  return <img src={url} alt={file.name} style={{ maxWidth: '100%' }} />;
}

export default ImageViewer;
