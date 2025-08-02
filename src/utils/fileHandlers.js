// Generate a unique ID for each tile
function generateId() {
  return 'tile-' + Math.random().toString(36).substr(2, 9);
}

export function handleDroppedFiles(fileList) {
  return fileList.map(file => {
    const url = URL.createObjectURL(file);
    const type = file.type || 'unknown';
    return {
      id: generateId(),
      name: file.name,
      size: file.size,
      type,
      src: url,
      raw: file
    };
  });
}

export async function handleUrlInput(url) {
  if (!url) return null;

  // Determine file type from extension or head request
  const fileName = url.split('/').pop();
  const ext = fileName.split('.').pop();
  const typeGuess = {
    mp4: 'video/mp4',
    mp3: 'audio/mpeg',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    pdf: 'application/pdf'
    // Add more types here
  }[ext.toLowerCase()] || 'application/octet-stream';

  return {
    id: generateId(),
    name: fileName,
    size: 0,
    type: typeGuess,
    src: url,
    raw: null
  };
}
