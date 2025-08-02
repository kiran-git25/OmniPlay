import React from 'react';

function FileTile({ file, onRemove }) {
  const renderPreview = () => {
    if (file.type.startsWith('image/')) {
      return <img src={file.src} alt={file.name} className="preview" />;
    } else if (file.type.startsWith('video/')) {
      return <video controls src={file.src} className="preview" />;
    } else if (file.type.startsWith('audio/')) {
      return <audio controls src={file.src} />;
    } else if (file.type === 'application/pdf') {
      return <iframe src={file.src} title={file.name} className="preview" />;
    } else {
      return <div className="preview unknown">Unsupported format</div>;
    }
  };

  return (
    <div className="file-tile">
      <div className="tile-header">
        <strong>{file.name}</strong>
        <button onClick={onRemove}>❌</button>
      </div>
      <div className="tile-body">
        {renderPreview()}
        <p className="meta">
          <span>{file.type}</span> | <span>{Math.round(file.size / 1024)} KB</span>
        </p>
      </div>
    </div>
  );
}

export default FileTile;
