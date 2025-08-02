import React, { useEffect, useState } from 'react';

function TextViewer({ file }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => setContent(reader.result);
    reader.readAsText(file);
  }, [file]);

  return (
    <pre style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>
  );
}

export default TextViewer;
