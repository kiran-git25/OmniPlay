import React from 'react';

function AudioViewer({ file }) {
  const url = URL.createObjectURL(file);
  return <audio controls src={url} />;
}

export default AudioViewer;
