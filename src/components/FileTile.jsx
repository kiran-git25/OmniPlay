import React from 'react';
import FileViewer from './FileViewer';

function FileTile({ file, onRemove }) {
  return (
    <div className="file-tile">
      <div className="file-header">
        <span>{file.name}</span>
        <button onClick={onRemove}>❌</button>
      </div>
      <FileViewer file={file} />
    </div>
  );
}

export default FileTile;
