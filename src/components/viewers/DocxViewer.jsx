import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';

function DocxViewer({ file }) {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  return (
    <div
      className="docx-viewer"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

export default DocxViewer;
