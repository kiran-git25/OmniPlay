import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function DocumentViewer({ file }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const readFile = async () => {
      const reader = new FileReader();

      if (file.name.endsWith('.docx')) {
        reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setContent(<div dangerouslySetInnerHTML={{ __html: result.value }} />);
        };
        reader.readAsArrayBuffer(file);
      }

      else if (file.name.match(/\.(xls|xlsx)$/)) {
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const html = XLSX.utils.sheet_to_html(sheet);
          setContent(<div dangerouslySetInnerHTML={{ __html: html }} />);
        };
        reader.readAsArrayBuffer(file);
      }

      else if (file.name.endsWith('.pdf')) {
        setContent(
          <Document file={file}>
            <Page pageNumber={1} />
          </Document>
        );
      }

      else {
        reader.onload = (e) => {
          setContent(<pre>{e.target.result}</pre>);
        };
        reader.readAsText(file);
      }
    };

    readFile();
  }, [file]);

  return <div className="document-viewer">{content}</div>;
}

export default DocumentViewer;
