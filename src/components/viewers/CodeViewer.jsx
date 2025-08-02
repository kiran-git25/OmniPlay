import React, { useEffect, useState } from 'react';

function CodeViewer({ file }) {
  const [code, setCode] = useState('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => setCode(reader.result);
    reader.readAsText(file);
  }, [file]);

  return (
    <pre style={{ whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: '10px' }}>
      <code>{code}</code>
    </pre>
  );
}

export default CodeViewer;
