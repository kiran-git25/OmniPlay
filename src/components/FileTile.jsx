import React from 'react';
import ImageViewer from './viewers/ImageViewer';
import PdfViewer from './viewers/PdfViewer';
import DocxViewer from './viewers/DocxViewer';
import ExcelViewer from './viewers/ExcelViewer';
import ZipViewer from './viewers/ZipViewer';
import CodeViewer from './viewers/CodeViewer';
import AudioVideoViewer from './viewers/AudioVideoViewer';
import UnknownViewer from './viewers/UnknownViewer';

const viewerMap = {
  image: ImageViewer,
  pdf: PdfViewer,
  docx: DocxViewer,
  xlsx: ExcelViewer,
  zip: ZipViewer,
  code: CodeViewer,
  media: AudioVideoViewer,
  unknown: UnknownViewer,
};

function FileTile({ file, onRemove }) {
  const Viewer = viewerMap[file.type] || UnknownViewer;

  return (
    <div className="file-tile">
      <div className="tile-header">
        <span className="tile-name">{file.name}</span>
        <button className="remove-btn" onClick={onRemove}>✖</button>
      </div>
      <Viewer file={file} />
    </div>
  );
}

export default FileTile;
