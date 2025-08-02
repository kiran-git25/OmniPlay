export function getFileCategory(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();

  const docs = ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'txt', 'md', 'json', 'csv', 'yaml', 'xml'];
  const media = ['mp4', 'mp3', 'webm', 'ogg', 'wav', 'jpg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'mov', 'mkv', 'flv', 'aac', 'flac', 'm4a'];
  const code = ['js', 'jsx', 'html', 'css', 'py', 'java', 'cpp', 'ts', 'sh'];
  const archives = ['zip'];

  if (docs.includes(ext)) return 'document';
  if (media.includes(ext)) return 'media';
  if (code.includes(ext)) return 'code';
  if (archives.includes(ext)) return 'zip';

  return 'unknown';
}
