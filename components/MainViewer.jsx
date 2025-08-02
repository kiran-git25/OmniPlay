import React, { useState, useEffect } from 'react';
import { FileTile } from './FileTile';
import { URLUploadTile } from './URLUploadTile';

export default function MainViewer() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  // Auto-delete files on tab close (privacy)
  useEffect(() => {
    const handleBeforeUnload = () => {
      setFiles([]);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).slice(0, 50 - files.length);
    const mapped = droppedFiles.map(file => ({
      file,
      id: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setFiles(prev => [...prev, ...mapped]);
  };

  const handlePasteUrl = (url) => {
    if (files.length < 50) {
      setFiles(prev => [...prev, { id: url, name: 'Loaded URL', type: 'url', url }]);
    }
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFile = (fromIndex, toIndex) => {
    const updated = [...files];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setFiles(updated);
  };

  const maximizeFile = (file) => {
    setActiveFile(file);
  };

  const closeMaximized = () => {
    setActiveFile(null);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="p-4 min-h-screen bg-gray-100 dark:bg-gray-900 transition-all"
    >
      {activeFile && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <button onClick={closeMaximized} className="mb-2 text-red-500">Close</button>
            <FileTile file={activeFile} isMaximized />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <URLUploadTile onPasteUrl={handlePasteUrl} />
        {files.map((file, index) => (
          <FileTile
            key={file.id}
            file={file}
            index={index}
            onRemove={() => removeFile(file.id)}
            onMaximize={() => maximizeFile(file)}
            onMove={moveFile}
            isMaximized={false}
          />
        ))}
      </div>
    </div>
  );
}
