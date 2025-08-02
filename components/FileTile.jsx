import React from 'react';

export function FileTile({ file, onRemove, onMaximize, index, onMove, isMaximized }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("fromIndex", index);
  };

  const handleDrop = (e) => {
    const fromIndex = e.dataTransfer.getData("fromIndex");
    if (fromIndex !== null && fromIndex !== index) {
      onMove(parseInt(fromIndex), index);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow p-2 cursor-pointer relative transition-all hover:shadow-lg ${
        isMaximized ? '' : 'h-48'
      }`}
      draggable={!isMaximized}
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={onMaximize}
    >
      <div className="text-sm truncate">{file.name}</div>
      <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
      <div className="text-xs text-gray-400 italic">{file.type}</div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1 right-1 text-xs text-red-600"
      >
        ✕
      </button>

      {!isMaximized && (
        <div className="mt-2 text-center text-gray-500 text-sm">Click to Maximize</div>
      )}
    </div>
  );
}
