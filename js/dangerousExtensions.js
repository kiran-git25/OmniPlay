// Dangerous file extensions that should only be viewed as text with warnings
const DANGEROUS_EXTENSIONS = [
    // Executable files
    'exe', 'msi', 'app', 'deb', 'rpm', 'dmg', 'pkg',
    
    // Script files
    'bat', 'cmd', 'ps1', 'sh', 'bash', 'zsh', 'fish',
    'vbs', 'vbe', 'js', 'jse', 'wsf', 'wsh',
    'py', 'pyw', 'rb', 'pl', 'php', 'asp', 'jsp',
    
    // System files
    'scr', 'pif', 'com', 'cpl', 'dll', 'sys', 'drv',
    'ocx', 'ax', 'gadget', 'msc', 'jar',
    
    // Macro-enabled office files
    'xlsm', 'xltm', 'docm', 'dotm', 'pptm', 'potm', 'ppam',
    
    // Archive with potential executables
    'rar', '7z', 'cab', 'ace', 'arj', 'lzh', 'tar.gz', 'tgz',
    
    // Other potentially dangerous
    'reg', 'inf', 'ade', 'adp', 'chm', 'hta', 'ins', 'isp',
    'job', 'lnk', 'mad', 'mdb', 'mde', 'mdt', 'mdw', 'mdz',
    'ops', 'pcd', 'prf', 'prg', 'pst', 'scf', 'sct', 'shb',
    'shs', 'url', 'vb', 'wsc'
];

const SAFE_EXTENSIONS = [
    // Documents
    'pdf', 'txt', 'doc', 'docx', 'rtf', 'odt', 'ods', 'odp',
    'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'epub', 'mobi',
    
    // Images
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico',
    'tiff', 'tif', 'raw', 'cr2', 'nef', 'arw', 'dng',
    
    // Audio
    'mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma', 'opus',
    'aiff', 'au', 'ra', 'amr', 'ac3', 'dts',
    
    // Video
    'mp4', 'webm', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'mpg',
    'mpeg', 'm4v', '3gp', 'ogv', 'rm', 'rmvb', 'asf',
    
    // Text/Code (safe to view)
    'html', 'htm', 'css', 'json', 'xml', 'yaml', 'yml',
    'md', 'markdown', 'rst', 'log', 'ini', 'cfg', 'conf',
    'c', 'cpp', 'h', 'hpp', 'java', 'kt', 'swift', 'go',
    'rust', 'rs', 'dart', 'lua', 'r', 'sql', 'gradle',
    
    // Archives (safe to extract and list)
    'zip', 'tar', 'gz', 'bz2', 'xz', 'lz4', 'zst'
];

function isDangerous(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    return DANGEROUS_EXTENSIONS.includes(extension);
}

function isSafe(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    return SAFE_EXTENSIONS.includes(extension);
}

function getFileCategory(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    if (DANGEROUS_EXTENSIONS.includes(extension)) {
        return 'dangerous';
    }
    
    if (['pdf', 'doc', 'docx', 'rtf', 'odt', 'xls', 'xlsx', 'csv', 'ppt', 'pptx'].includes(extension)) {
        return 'document';
    }
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'].includes(extension)) {
        return 'image';
    }
    
    if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(extension)) {
        return 'audio';
    }
    
    if (['mp4', 'webm', 'avi', 'mov', 'mkv', 'flv'].includes(extension)) {
        return 'video';
    }
    
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
        return 'archive';
    }
    
    if (['txt', 'html', 'css', 'js', 'json', 'xml', 'md'].includes(extension)) {
        return 'text';
    }
    
    return 'unknown';
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DANGEROUS_EXTENSIONS,
        SAFE_EXTENSIONS,
        isDangerous,
        isSafe,
        getFileCategory
    };
}

// Global availability
window.DangerousExtensions = {
    DANGEROUS_EXTENSIONS,
    SAFE_EXTENSIONS,
    isDangerous,
    isSafe,
    getFileCategory
};