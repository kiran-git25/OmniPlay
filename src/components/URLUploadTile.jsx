import React, { useState } from 'react';

function URLUploadTile({ onUrlSubmit }) {
  const [url, setUrl] = useState('');
  const submit = () => {
    if (url) {
      onUrlSubmit(url);
      setUrl('');
    }
  };

  return (
    <div className="url-tile">
      <input
        type="text"
        value={url}
        placeholder="Paste a URL (image, video, doc...)"
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={submit}>Load</button>
    </div>
  );
}

export default URLUploadTile;
