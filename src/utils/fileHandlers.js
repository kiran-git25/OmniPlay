import mammoth from 'mammoth';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';

export async function handleDroppedFiles(files) {
  return Promise.all(files.map(file => readFileToTile(file)));
}

export async function handleUrlInput(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  const name = url.split('/').pop();
  return readFileToTile(new File([blob], name, { type: blob.type }));
}

export async function readFileToTile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const blob = file;

  if (ext === 'pdf') return { id: Date.now(), type: 'pdf', name: file.name, blob };
  if (ext === 'docx') return { id: Date.now(), type: 'docx', name: file.name, blob };
  if (['xlsx', 'xls'].includes(ext)) return { id: Date.now(), type: 'excel', name: file.name, blob };
  if (['txt', 'md', 'csv', 'json', 'xml', 'yaml', 'yml'].includes(ext)) return { id: Date.now(), type: 'text', name: file.name, blob };
  if (['js', 'html', 'css', 'py', 'java', 'cpp', 'ts'].includes(ext)) return { id: Date.now(), type: 'code', name: file.name, blob };
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext)) return { id: Date.now(), type: 'image', name: file.name, blob };
  if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(ext)) return { id: Date.now(), type: 'audio', name: file.name, blob };
  if (['mp4', 'webm', 'avi', 'mov', 'mkv', 'flv'].includes(ext)) return { id: Date.now(), type: 'video', name: file.name, blob };
  if (ext === 'zip') return { id: Date.now(), type: 'zip', name: file.name, blob };

  return { id: Date.now(), type: 'unknown', name: file.name, blob };
}
