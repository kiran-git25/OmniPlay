import React from 'react';
import PdfViewer from './viewers/PdfViewer';
import DocxViewer from './viewers/DocxViewer';
import ExcelViewer from './viewers/ExcelViewer';
import TextViewer from './viewers/TextViewer';
import CodeViewer from './viewers/CodeViewer';
import ImageViewer from './viewers/ImageViewer';
import AudioViewer from './viewers/AudioViewer';
import VideoViewer from './viewers/VideoViewer';
import ZipViewer from './viewers/ZipViewer';
import UnknownViewer from './viewers/UnknownViewer';

function FileTile({ file, onRemove }) {
  const renderViewer = () => {
    const { type, blob, name, url } = file;
    if (type === 'pdf') return <PdfViewer file={blob} />;
    if (type === 'docx') return <DocxViewer file={blob} />;
    if (type === 'excel') return <ExcelViewer file={blob} />;
    if (type === 'text') return <TextViewer file={blob} />;
    if (type === 'code') return <CodeViewer file={blob} name={name} />;
    if (type === 'image') return <ImageViewer file={blob || url} />;
    if (type === 'audio') return <AudioViewer file={blob || url} />;
    if (type === 'video') return <VideoViewer file={blob || url} />;
    if (type === 'zip') return <ZipViewer file={blob} />;
    return <UnknownViewer file={blob} />;
  };

  return (
    <div className="tile">
      <div className="tile-header">
        <span>{file.name}</span>
        <button onClick={onRemove}>❌</button>
      </div>
      <div className="tile-content">{renderViewer()}</div>
    </div>
  );
}

export default FileTile;
