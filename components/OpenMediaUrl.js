import React, { useState } from 'react';

export default function OpenMediaUrl({ onLoad }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoad = async () => {
    setError('');
    setLoading(true);

    try {
      const parsed = parseUrl(url);

      if (!parsed) {
        setError('Unsupported or invalid media URL');
        setLoading(false);
        return;
      }

      onLoad({
        ...parsed,
        url,
        isRemote: true,
        lastModified: Date.now(),
        name: parsed.name || 'external-media',
      });

      setUrl('');
    } catch (err) {
      setError('Failed to load media');
    }

    setLoading(false);
  };

  const parseUrl = (url) => {
    try {
      const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/);
      if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        return {
          type: 'youtube',
          embed: `https://www.youtube.com/embed/${videoId}`,
          name: 'YouTube Video',
        };
      }

      const instaMatch = url.match(/instagram\.com\/(?:reel|p)\/([^/?#&]+)/);
      if (instaMatch) {
        return {
          type: 'instagram',
          embed: url,
          name: 'Instagram Reel',
        };
      }

      const extension = url.split('.').pop().toLowerCase();
      const supported = [
        'mp4', 'mp3', 'webm', 'ogg', 'aac', 'wav', 'flac', 'm4a',
        'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp',
        'pdf', 'txt', 'json', 'xml', 'csv'
      ];

      if (supported.includes(extension)) {
        return {
          type: 'direct',
          embed: url,
          name: url.split('/').pop(),
        };
      }

      return null;
    } catch {
      return null;
    }
  };

  return (
    <div style={styles.wrapper}>
      <input
        type="url"
        value={url}
        placeholder="Paste a media link (YouTube, Instagram, MP4...)"
        onChange={(e) => setUrl(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleLoad} disabled={loading || !url} style={styles.button}>
        {loading ? 'Loading...' : 'Load'}
      </button>
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    maxWidth: '700px',
    margin: '0 auto',
    gap: '12px',
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px',
    backgroundColor: '#4A90E2',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    minWidth: '120px',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
    marginTop: '-8px',
  }
};
