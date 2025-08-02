import React, { useState } from 'react';

export function URLUploadTile({ onPasteUrl }) {
  const [url, setUrl] = useState('');

  const handlePaste = () => {
    if (url.trim() !== '') {
      onPasteUrl(url.trim());
      setUrl('');
    }
  };

  return (
    <div className="bg-blue-100 dark:bg-blue-800 rounded-xl p-4 flex flex-col justify-between">
      <input
        type="text"
        placeholder="Paste media URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="p-2 rounded bg-white dark:bg-gray-700 text-sm"
      />
      <button onClick={handlePaste} className="mt-2 text-sm text-blue-800 dark:text-blue-200">
        Load
      </button>
    </div>
  );
}
