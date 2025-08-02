import React, { useState } from 'react';

function URLUploadTile({ onUrlSubmit }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlSubmit(url.trim());
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="url-upload">
      <input
        type="url"
        placeholder="Paste media/file URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="submit">Load</button>
    </form>
  );
}

export default URLUploadTile;
