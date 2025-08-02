import React, { useState } from 'react';

function URLUploadTile({ onUrlSubmit }) {
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (url.trim()) {
      onUrlSubmit(url);
      setUrl('');
    }
  };

  return (
    <div className="file-tile">
      <input
        type="text"
        placeholder="Paste file URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleSubmit}>Load URL</button>
    </div>
  );
}

export default URLUploadTile;
