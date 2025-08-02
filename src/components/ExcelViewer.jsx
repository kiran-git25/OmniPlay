import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

function ExcelViewer({ file }) {
  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    const readExcel = async () => {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetData = workbook.SheetNames.map(name => ({
        name,
        data: XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 }),
      }));

      setSheets(sheetData);
    };

    readExcel();
  }, [file]);

  return (
    <div>
      {sheets.map((sheet, index) => (
        <div key={index}>
          <h3>{sheet.name}</h3>
          <table>
            <tbody>
              {sheet.data.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => <td key={j}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default ExcelViewer;
