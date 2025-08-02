import React, { useEffect, useRef } from 'react';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

function DocumentViewer({ file }) {
  const ref = useRef();

  useEffect(() => {
    const ext = file.name?.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
      const reader = new FileReader();
      reader.onload = function () {
        const typedarray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedarray).promise.then(pdf => {
          pdf.getPage(1).then(page => {
            const canvas = document.createElement('canvas');
            ref.current.innerHTML = '';
            ref.current.appendChild(canvas);
            const context = canvas.getContext('2d');
            const viewport = page.getViewport({ scale: 1.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            page.render({ canvasContext: context, viewport });
          });
        });
      };
      reader.readAsArrayBuffer(file);
    }

    else if (ext === 'docx') {
      const reader = new FileReader();
      reader.onload = function () {
        mammoth.convertToHtml({ arrayBuffer: this.result }).then(result => {
          ref.current.innerHTML = result.value;
        });
      };
      reader.readAsArrayBuffer(file);
    }

    else if (['xlsx', 'xls'].includes(ext)) {
      const reader = new FileReader();
      reader.onload = function () {
        const workbook = XLSX.read(this.result, { type: 'binary' });
        const html = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]);
        ref.current.innerHTML = html;
      };
      reader.readAsBinaryString(file);
    }

    else {
      const reader = new FileReader();
      reader.onload = () => {
        ref.current.textContent = reader.result;
      };
      reader.readAsText(file);
    }
  }, [file]);

  return <div ref={ref}></div>;
}

export default DocumentViewer;
