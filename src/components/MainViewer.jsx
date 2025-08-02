import React, { useState } from 'react';
import FileTile from './FileTile';
import URLUploadTile from './URLUploadTile';
import { handleDroppedFiles, handleUrlInput } from '../utils/fileHandlers';

function MainViewer() {
  const [files, setFiles] = useState([]);

  // Handle file drop
  const onDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const newTiles = handleDroppedFiles(droppedFiles);
    setFiles(prev => [...prev, ...newTiles]);
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const handleUrl = async (url) => {
    const tile = await handleUrlInput(url);
    if (tile) setFiles(prev => [...prev, tile]);
  };

  const removeTile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  return (
    <div className="viewer">
      <div
        className="dropzone"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <p>📁 Drag & Drop files here (or paste a link below)</p>
      </div>

      <URLUploadTile onUrlSubmit={handleUrl} />

      <div className="file-grid">
        {files.map(file => (
          <FileTile key={file.id} file={file} onRemove={() => removeTile(file.id)} />
        ))}
      </div>
    </div>
  );
}

export default MainViewer;
