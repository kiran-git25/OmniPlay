# Replit.md

## Overview

This is a Node.js workspace project that appears to be focused on document processing and web service capabilities. The project uses Express.js for web server functionality and includes libraries for handling various document formats including ZIP archives, Word documents (DOCX), and PDF files. There's also a curl format configuration file suggesting HTTP request timing analysis capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Testing Results (August 1, 2025)

### Application Status
- Successfully deployed OmniPlay universal file viewer
- All core functionality tested and working
- Comprehensive file format support verified
- GitHub workflows validated and operational

### Privacy Enhancement (August 1, 2025)
- Implemented absolute no-data-storage policy
- Disabled localStorage and sessionStorage
- Added automatic memory cleanup
- Enhanced security headers for zero caching
- Created privacy enforcement documentation

### Complete Feature Implementation (August 1, 2025)
- Added dangerous file detection and safety warnings
- Implemented URL input modal for remote media loading
- Created comprehensive legal documentation (MIT License, Terms, Privacy, Security, Disclaimer, Ethical Use)
- Built automated security testing suite
- Enhanced UI with dual browse/URL buttons
- Added ethical notice with privacy-first messaging
- Implemented networking features with P2P chat and file sharing
- Added offline (LAN/Bluetooth/Wi-Fi Direct) and online (WebRTC) modes
- Created peer discovery with QR code sharing
- Completed all specification requirements for production deployment

## System Architecture

### Backend Architecture
- **Framework**: Express.js (v5.1.0) for HTTP server and API endpoints
- **Runtime**: Node.js environment
- **Document Processing Pipeline**: Multi-format document handling system supporting:
  - ZIP archive manipulation via JSZip
  - Word document (.docx) processing via Mammoth
  - PDF document handling via pdf-dist

### Application Structure
- **Single Entry Point**: Standard Node.js application with index.js as main entry point
- **Modular Dependencies**: Clear separation of concerns with specialized libraries for different document types
- **HTTP Performance Monitoring**: Integrated curl timing format for request analysis and debugging

### Document Processing Strategy
- **ZIP Handling**: JSZip library for creating, reading, and manipulating ZIP archives
- **Word Documents**: Mammoth library for converting DOCX files, likely to HTML or extracting text content
- **PDF Processing**: pdf-dist for PDF document manipulation and processing
- **Format Agnostic Design**: Architecture supports multiple document formats through dedicated processors

### Development Environment
- **Package Management**: NPM with lock file for dependency consistency
- **Version Control**: Standard Node.js project structure with package.json configuration
- **Performance Tools**: Curl format configuration for HTTP request timing analysis

## External Dependencies

### Core Web Framework
- **Express.js**: HTTP server framework for API endpoints and web service functionality

### Document Processing Libraries
- **JSZip**: JavaScript library for creating, reading and editing ZIP files
- **Mammoth**: Library for converting Word documents (.docx) to HTML or extracting content
- **pdf-dist**: PDF processing and manipulation library

### Supporting Dependencies
- **@xmldom/xmldom**: XML parsing and manipulation (likely used by document processors)
- **Various Utility Libraries**: Including argparse for command-line argument parsing, base64-js for encoding operations, and MIME type handling utilities

### Development Tools
- **curl**: HTTP request timing and performance analysis tool (configuration file present)