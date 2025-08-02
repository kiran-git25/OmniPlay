import React, { useEffect, useState } from 'react';
import JSZip from 'jszip';

function ArchiveViewer({ file }) {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const unzip = async () => {
      const zip = await JSZip.loadAsync(file);
      const entries = Object.keys(zip.files);
      setFileList(entries);
    };
    unzip();
  }, [file]);

  return (
    <div>
      <h4>ZIP Contents</h4>
      <ul>
        {fileList.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
    </div>
  );
}

export default ArchiveViewer;
