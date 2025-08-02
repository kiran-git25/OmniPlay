import React, { useState } from 'react';

function URLUploadTile({ onUrlSubmit }) {
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (url) {
      onUrlSubmit(url);
      setUrl('');
    }
  };

  return (
    <div className="url-upload-tile">
      <input
        type="text"
        placeholder="Paste a URL (image, video, doc...)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleSubmit}>Load</button>
    </div>
  );
}

export default URLUploadTile;
