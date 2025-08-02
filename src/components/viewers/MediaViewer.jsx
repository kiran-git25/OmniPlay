import React from 'react';

function MediaViewer({ file, type }) {
  const url = URL.createObjectURL(file);

  switch (type) {
    case 'image':
      return <img src={url} alt="img" style={{ maxWidth: '100%' }} />;
    case 'audio':
      return <audio src={url} controls />;
    case 'video':
      return <video src={url} controls width="100%" />;
    default:
      return <div>Unsupported media type</div>;
  }
}

export default MediaViewer;
