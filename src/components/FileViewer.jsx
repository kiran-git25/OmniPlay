import React from 'react';
import DocumentViewer from './viewers/DocumentViewer';
import MediaViewer from './viewers/MediaViewer';
import CodeViewer from './viewers/CodeViewer';
import ArchiveViewer from './viewers/ArchiveViewer';

function FileViewer({ file }) {
  const type = file.type || '';
  const name = file.name || '';

  if (type.startsWith('image/') || /\.(jpg|png|gif|svg|webp|bmp|ico)$/i.test(name)) {
    return <MediaViewer file={file} type="image" />;
  }
  if (type.startsWith('audio/') || /\.(mp3|wav|ogg|aac|flac|m4a)$/i.test(name)) {
    return <MediaViewer file={file} type="audio" />;
  }
  if (type.startsWith('video/') || /\.(mp4|webm|avi|mov|mkv|flv)$/i.test(name)) {
    return <MediaViewer file={file} type="video" />;
  }
  if (/\.(pdf|docx?|xlsx?|txt|md|json|xml|csv|yaml|yml)$/i.test(name)) {
    return <DocumentViewer file={file} />;
  }
  if (/\.(zip|rar|7z)$/i.test(name)) {
    return <ArchiveViewer file={file} />;
  }
  if (/\.(js|jsx|ts|tsx|html|css|py|java|c|cpp|json)$/i.test(name)) {
    return <CodeViewer file={file} />;
  }

  return <div>🗂️ Cannot preview this file type.</div>;
}

export default FileViewer;
