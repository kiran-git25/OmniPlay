import React from 'react';

function MediaViewer({ file }) {
  const url = URL.createObjectURL(file);
  const type = file.type;

  if (type.startsWith('image/')) return <img src={url} alt="preview" style={{ maxWidth: '100%' }} />;
  if (type.startsWith('audio/')) return <audio src={url} controls />;
  if (type.startsWith('video/')) return <video src={url} controls style={{ width: '100%' }} />;

  return <div>Unsupported media</div>;
}

export default MediaViewer;
