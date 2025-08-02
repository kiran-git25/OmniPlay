import React from 'react';
import DocumentViewer from '../viewers/DocumentViewer';
import MediaViewer from '../viewers/MediaViewer';
import CodeViewer from '../viewers/CodeViewer';
import ZipViewer from '../viewers/ZipViewer';

function FileTile({ file, onRemove }) {
  let viewer;

  if (file.type === 'document') {
    viewer = <DocumentViewer file={file.file} />;
  } else if (file.type === 'media') {
    viewer = <MediaViewer file={file.file} />;
  } else if (file.type === 'code') {
    viewer = <CodeViewer file={file.file} />;
  } else if (file.type === 'zip') {
    viewer = <ZipViewer file={file.file} />;
  } else {
    viewer = <div>Unsupported file</div>;
  }

  return (
    <div className="file-tile">
      <strong>{file.name}</strong>
      {viewer}
      <button onClick={onRemove}>Remove</button>
    </div>
  );
}

export default FileTile;
