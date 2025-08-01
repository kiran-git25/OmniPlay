# OmniPlay Universal File Viewer

## Overview
OmniPlay is a **client-side universal file viewer** that supports 55+ file formats without uploading files to any server.

## Features

### 🔒 Security
- **100% Client-Side Processing** - No file uploads
- **Privacy Respecting** - No tracking or analytics  
- **Sandboxed Environment** - Safe file handling

### 📁 File Format Support

#### Documents
- **PDF** - Native PDF viewer with zoom and navigation
- **Word** - `.docx`, `.doc` files
- **Excel** - `.xlsx`, `.xls`, `.csv` spreadsheets
- **PowerPoint** - `.pptx`, `.ppt` presentations

#### Images
- **Raster Images** - `.jpg`, `.png`, `.gif`, `.bmp`, `.webp`
- **Vector Graphics** - `.svg` with full interactivity
- **Icons** - `.ico` files

#### Text & Code
- **Plain Text** - `.txt`, `.rtf` files
- **Markup** - `.md`, `.html`, `.xml`
- **Data** - `.json`, `.yaml`, `.csv`
- **Code** - `.js`, `.css`, `.py`, `.java`, `.cpp`

#### Archives
- **Compression** - `.zip`, `.rar`, `.7z`, `.tar`, `.gz`

#### Media
- **Audio** - `.mp3`, `.wav`, `.ogg`, `.flac`, `.aac`
- **Video** - `.mp4`, `.webm`, `.mkv`, `.avi`, `.mov`

## Usage

1. **Drag & Drop** - Simply drag files onto the application
2. **Browse Files** - Click the browse button to select files
3. **Multi-file Support** - Load multiple files simultaneously
4. **Remote URLs** - Load files directly from web URLs

## Technical Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Files    │───▶│   OmniPlay App   │───▶│   File Viewer   │
│                 │    │                  │    │                 │
│ • Local Files   │    │ • File Handler   │    │ • PDF Viewer    │
│ • Remote URLs   │    │ • Type Detection │    │ • Image Display │
│ • Drag & Drop   │    │ • Security Check │    │ • Text Editor   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Security Model

> **No Server Processing**: All file operations happen in your browser
> 
> **No Data Collection**: Files never leave your device
> 
> **Safe Execution**: No code execution from uploaded files

## Browser Compatibility

- ✅ Chrome/Chromium 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers

## Code Example

```javascript
// Initialize OmniPlay
const omniplay = new OmniPlay();

// Handle file drop
omniplay.handleDrop(files);

// Process supported formats
omniplay.processFiles(fileList);
```

---

**Built with ❤️ for universal file access**