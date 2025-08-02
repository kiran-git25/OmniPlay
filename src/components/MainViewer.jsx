import React, { useState } from 'react';
import FileTile from './FileTile';
import URLUploadTile from './URLUploadTile';
import { handleDroppedFiles, handleUrlInput } from '../utils/fileHandlers';

function MainViewer() {
  const [files, setFiles] = useState([]);

  const onDrop = async (event) => {
    event.preventDefault();
    const dropped = Array.from(event.dataTransfer.files);
    const newTiles = await handleDroppedFiles(dropped);
    setFiles(prev => [...prev, ...newTiles]);
  };

  const onDragOver = (event) => event.preventDefault();

  const handleUrl = async (url) => {
    const tile = await handleUrlInput(url);
    if (tile) setFiles(prev => [...prev, tile]);
  };

  const removeTile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  return (
    <div className="viewer" onDrop={onDrop} onDragOver={onDragOver}>
      <p>📁 Drag & Drop files here or paste a URL below</p>
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
