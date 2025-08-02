import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';

function DocxViewer({ file }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    const readDocx = async () => {
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.convertToHtml({ arrayBuffer });
      setContent(value);
    };

    readDocx();
  }, [file]);

  return (
    <div dangerouslySetInnerHTML={{ __html: content }} style={{ padding: '1rem' }} />
  );
}

export default DocxViewer;
