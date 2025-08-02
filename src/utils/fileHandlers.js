import { v4 as uuidv4 } from 'uuid';

export function handleDroppedFiles(files) {
  return files.map(file => ({
    id: uuidv4(),
    file,
    type: detectFileType(file),
  }));
}

export async function handleUrlInput(url) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const name = url.split('/').pop().split('?')[0];
    const file = new File([blob], name || 'remote-file', { type: blob.type });
    return {
      id: uuidv4(),
      file,
      type: detectFileType(file),
    };
  } catch (e) {
    alert("Failed to fetch file: " + e.message);
    return null;
  }
}

function detectFileType(file) {
  const name = file.name.toLowerCase();
  const mime = file.type;

  if (mime.includes('pdf') || name.endsWith('.pdf')) return 'pdf';
  if (name.endsWith('.docx')) return 'docx';
  if (name.endsWith('.xls') || name.endsWith('.xlsx')) return 'excel';
  if (name.endsWith('.txt') || name.endsWith('.csv') || name.endsWith('.json') ||
      name.endsWith('.xml') || name.endsWith('.yaml') || name.endsWith('.md')) return 'text';

  if (name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.html') ||
      name.endsWith('.css') || name.endsWith('.java') || name.endsWith('.py') ||
      name.endsWith('.cpp') || name.endsWith('.c') || name.endsWith('.cs')) return 'code';

  if (mime.startsWith('image/') || name.match(/\.(jpg|jpeg|png|gif|webp|bmp|ico|svg)$/)) return 'image';
  if (mime.startsWith('audio/') || name.match(/\.(mp3|wav|ogg|aac|flac|m4a)$/)) return 'audio';
  if (mime.startsWith('video/') || name.match(/\.(mp4|webm|avi|mov|mkv|flv)$/)) return 'video';

  if (name.endsWith('.zip')) return 'zip';
  if (name.endsWith('.rar') || name.endsWith('.7z')) return 'archive';

  return 'unknown';
}
