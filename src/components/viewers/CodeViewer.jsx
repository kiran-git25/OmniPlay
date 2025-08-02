import React, { useEffect, useState } from 'react';

function CodeViewer({ file }) {
  const [code, setCode] = useState('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => setCode(e.target.result);
    reader.readAsText(file);
  }, [file]);

  return (
    <pre style={{ background: '#1e1e1e', color: '#dcdcdc', padding: '1rem', overflowX: 'auto' }}>
      <code>{code}</code>
    </pre>
  );
}

export default CodeViewer;
