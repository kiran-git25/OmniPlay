import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

function CodeViewer({ file }) {
  const ref = useRef();

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      ref.current.textContent = reader.result;
      hljs.highlightElement(ref.current);
    };
    reader.readAsText(file);
  }, [file]);

  return <pre><code ref={ref} className="hljs" /></pre>;
}

export default CodeViewer;
