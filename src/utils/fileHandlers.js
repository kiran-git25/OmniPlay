import { getFileCategory } from './mimeTypes';

export function handleDroppedFiles(fileList) {
  return fileList.map(file => ({
    id: Date.now() + Math.random(),
    name: file.name,
    type: getFileCategory(file.name),
    file
  }));
}

export async function handleUrlInput(url) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const name = url.split('/').pop().split('?')[0];
    return {
      id: Date.now() + Math.random(),
      name,
      type: getFileCategory(name),
      file: blob
    };
  } catch (err) {
    console.error('Invalid URL:', err);
    return null;
  }
}
