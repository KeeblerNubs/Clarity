export const FILE_TYPES = {
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.heic', '.svg', '.raw', '.cr2', '.nef'],
  video: ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm', '.m4v', '.mpg', '.mpeg'],
  audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma'],
  document: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf', '.odt'],
  code: ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.html', '.css', '.json', '.xml', '.yaml'],
  archive: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
};

export function getFileType(ext) {
  const lower = ext.toLowerCase();
  for (const [type, exts] of Object.entries(FILE_TYPES)) {
    if (exts.includes(lower)) return type;
  }
  return 'other';
}

export function getFileIcon(type) {
  const icons = {
    image: 'ti-photo',
    video: 'ti-movie',
    audio: 'ti-music',
    document: 'ti-file-text',
    code: 'ti-code',
    archive: 'ti-file-zip',
    other: 'ti-file',
  };
  return icons[type] || 'ti-file';
}

export function getTypeColor(type) {
  const colors = {
    image: '#4f8ef7',
    video: '#a855f7',
    audio: '#22c55e',
    document: '#f59e0b',
    code: '#06b6d4',
    archive: '#f97316',
    other: '#6b7280',
  };
  return colors[type] || '#6b7280';
}

export function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function groupFilesByType(files) {
  const groups = {};
  for (const file of files) {
    const type = getFileType(file.ext);
    if (!groups[type]) groups[type] = [];
    groups[type].push(file);
  }
  return groups;
}

export function sortFiles(files, sortBy) {
  return [...files].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'size') return b.size - a.size;
    if (sortBy === 'type') return getFileType(a.ext).localeCompare(getFileType(b.ext));
    // default: modified
    return new Date(b.modified) - new Date(a.modified);
  });
}

export function filterFiles(files, type, query) {
  let result = files;
  if (type && type !== 'all') {
    result = result.filter(f => getFileType(f.ext) === type);
  }
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(f => f.name.toLowerCase().includes(q) || (f.tags || []).some(t => t.toLowerCase().includes(q)));
  }
  return result;
}
