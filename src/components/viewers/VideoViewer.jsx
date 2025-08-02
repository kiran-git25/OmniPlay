import React from 'react';

function VideoViewer({ file }) {
  const url = URL.createObjectURL(file);
  return <video controls src={url} width="100%" />;
}

export default VideoViewer;
