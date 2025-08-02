import React, { useEffect, useState } from 'react';
import JSZip from 'jszip';

function ZipViewer({ file }) {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = async () => {
      const zip = await JSZip.loadAsync(reader.result);
      const list = Object.keys(zip.files);
      setFileList(list);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  return (
    <ul>
      {fileList.map((name, i) => (
        <li key={i}>{name}</li>
      ))}
    </ul>
  );
}

export default ZipViewer;
