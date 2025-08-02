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
  let ViewerComponent;

  switch (file.type) {
    case 'pdf': ViewerComponent = PdfViewer; break;
    case 'docx': ViewerComponent = DocxViewer; break;
    case 'excel': ViewerComponent = ExcelViewer; break;
    case 'text': ViewerComponent = TextViewer; break;
    case 'code': ViewerComponent = CodeViewer; break;
    case 'image': ViewerComponent = ImageViewer; break;
    case 'audio': ViewerComponent = AudioViewer; break;
    case 'video': ViewerComponent = VideoViewer; break;
    case 'zip': ViewerComponent = ZipViewer; break;
    default: ViewerComponent = UnknownViewer;
  }

  return (
    <div className="file-tile">
      <button onClick={onRemove}>✖</button>
      <strong>{file.file.name}</strong>
      <ViewerComponent file={file.file} />
    </div>
  );
}

export default FileTile;
