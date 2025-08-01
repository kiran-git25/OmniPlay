# 🎯 OmniPlay - Universal File Viewer

A privacy-first, client-side universal file viewer that supports 55+ file formats with zero data tracking or storage.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Privacy First](https://img.shields.io/badge/Privacy-First-blue.svg)](#privacy--security)
[![No Data Storage](https://img.shields.io/badge/Data%20Storage-None-red.svg)](#privacy--security)

## ✨ Features

### 🔒 Privacy & Ethics First
- **Zero data collection** - No tracking, analytics, or user data storage
- **Client-side processing** - All file processing happens in your browser
- **No server uploads** - Files never leave your device
- **Automatic cleanup** - Memory is automatically cleared after use
- **Ethical usage guidelines** - Built-in responsible usage guidance

### 📁 Universal File Support (55+ Formats)

#### Documents
- **PDF** - Native browser PDF viewer
- **Word** - `.docx`, `.doc` with Mammoth.js conversion
- **Excel** - `.xlsx`, `.xls` support (requires XLSX library integration)
- **Text** - `.txt`, `.md`, `.json`, `.xml`, `.csv`, `.yaml`
- **Code** - JavaScript, HTML, CSS, Python, Java, and more

#### Media Files
- **Images** - `.jpg`, `.png`, `.gif`, `.svg`, `.webp`, `.bmp`, `.ico`
- **Audio** - `.mp3`, `.wav`, `.ogg`, `.aac`, `.flac`, `.m4a`
- **Video** - `.mp4`, `.webm`, `.avi`, `.mov`, `.mkv`, `.flv`

#### Archives
- **ZIP** - Full extraction and file listing with JSZip
- **RAR, 7Z** - Limited browser-dependent support

### 🔗 URL Support
- **Direct media URLs** - Load audio, video, and images from URLs
- **Document URLs** - Access PDFs and text files remotely
- **Safety validation** - URL format and security checking
- **CORS compliance** - Respects cross-origin policies

### 🛡️ Security Features
- **Dangerous file detection** - Warns about potentially unsafe file types
- **Sandboxed viewing** - Dangerous files displayed as text only
- **Content Security Policy** - Prevents XSS and unauthorized scripts
- **Memory protection** - Automatic cleanup prevents data leaks
- **No execution** - Files are never executed, only viewed

## 🚀 Quick Start

### Web Application
1. **Open OmniPlay** - Visit the web application
2. **Drop files** - Drag and drop files onto the interface
3. **Browse files** - Click "Browse Files" to select files
4. **Open URLs** - Click "Open URL" to load remote media

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/omniplay.git
cd omniplay

# Install dependencies
npm install

# Start development server
npm start

# Open browser
open http://localhost:5000
```

## 🔒 Privacy & Security

### Privacy Guarantees
- **No data collection** - We never collect personal information
- **No analytics** - No usage tracking or behavior monitoring
- **No storage** - Files are not saved or cached anywhere
- **No transmission** - File content never leaves your device

### Security Measures
- **File type validation** - Comprehensive dangerous file detection
- **User warnings** - Clear alerts for potentially unsafe files
- **Memory cleanup** - Automatic cleanup prevents data persistence
- **CSP headers** - Content Security Policy prevents attacks
- **HTTPS enforcement** - Secure connections for external content

### Compliance
- **GDPR compliant** - Privacy by design implementation
- **CCPA compliant** - No personal data collection
- **SOC 2 principles** - Security and privacy controls

## 🛠️ Technical Architecture

### Client-Side Processing
- **Browser-native APIs** - FileReader, Blob, URL APIs
- **No server dependencies** - Complete client-side operation
- **Memory-only processing** - No persistent storage

### Libraries Used
- **JSZip** - ZIP archive processing
- **Mammoth.js** - Word document conversion
- **PDF-dist** - PDF processing support

### Security Implementation
- **Content Security Policy** - Strict CSP headers
- **Storage API blocking** - localStorage/sessionStorage disabled
- **Object URL management** - Automatic blob URL cleanup
- **Memory monitoring** - Proactive memory management

## 📚 Documentation

### User Guides
- [**Privacy Policy**](PRIVACY.md) - Comprehensive privacy information
- [**Terms of Use**](TERMS.md) - User responsibilities and guidelines
- [**Security Policy**](SECURITY.md) - Technical security measures
- [**Ethical Use Guidelines**](ETHICAL_USE.md) - Responsible usage principles

### Technical Documentation
- [**API Documentation**](docs/api.md) - Developer API reference
- [**Security Testing**](test/security-test.js) - Automated security tests
- [**Contributing Guide**](CONTRIBUTING.md) - How to contribute

## 🧪 Testing

### Security Testing
```bash
# Run security tests
npm run test:security

# Run all tests
npm test

# Generate security report
npm run security:report
```

### Manual Testing
1. **File upload testing** - Test various file types
2. **URL loading testing** - Test remote content loading
3. **Security testing** - Test dangerous file warnings
4. **Privacy testing** - Verify no data persistence

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Fork and clone the repository
git clone https://github.com/your-username/omniplay.git

# Create a feature branch
git checkout -b feature/your-feature

# Make changes and test
npm test

# Submit a pull request
```

### Code of Conduct
- **Respect privacy** - Maintain privacy-first principles
- **Security conscious** - Consider security implications
- **Ethical development** - Follow ethical guidelines
- **Quality focus** - Maintain high code quality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## ⚖️ Legal

### Disclaimer
OmniPlay is provided "as is" without warranties. See [DISCLAIMER.md](DISCLAIMER.md) for details.

### Usage Notice
> OmniPlay is intended for legal personal use only. The authors are not liable for any misuse of this application.

## 🔧 Browser Support

- **Chrome/Chromium** - Full support
- **Firefox** - Full support  
- **Safari** - Full support
- **Edge** - Full support
- **Mobile browsers** - Responsive design support

## 🌟 Key Benefits

### For Users
- **Privacy protection** - Your files stay private
- **Universal compatibility** - One tool for all file types
- **No installation** - Works in any modern browser
- **Free and open** - No cost, no registration required

### For Organizations
- **Compliance friendly** - Meets privacy regulations
- **Security focused** - Comprehensive security measures
- **Self-hosted option** - Can be deployed internally
- **Audit ready** - Open source for security review

## 📞 Support

### Getting Help
- **Documentation** - Check the docs folder for guides
- **Issues** - Report bugs via GitHub Issues
- **Security** - Report security issues responsibly
- **Community** - Join discussions in project forums

### Reporting Issues
1. **Search existing issues** - Check if already reported
2. **Provide details** - Include browser, file types, steps to reproduce
3. **Security issues** - Follow responsible disclosure
4. **Feature requests** - Explain use case and benefits

---

**Built with privacy, security, and user empowerment in mind.**

*OmniPlay - Your files, your device, your privacy.*