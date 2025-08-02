import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

function ExcelViewer({ file }) {
  const [table, setTable] = useState('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const html = XLSX.utils.sheet_to_html(workbook.Sheets[workbook.SheetNames[0]]);
      setTable(html);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  return <div dangerouslySetInnerHTML={{ __html: table }} />;
}

export default ExcelViewer;
