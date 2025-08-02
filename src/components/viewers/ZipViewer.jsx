import React, { useEffect, useState } from 'react';
import JSZip from 'jszip';

function ZipViewer({ file }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = async () => {
      const zip = await JSZip.loadAsync(reader.result);
      const entries = [];
      zip.forEach((path, zipEntry) => {
        entries.push(path);
      });
      setFiles(entries);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  return (
    <div>
      <strong>ZIP Contents:</strong>
      <ul>
        {files.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
    </div>
  );
}

export default ZipViewer;
