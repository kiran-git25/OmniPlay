import React, { useEffect, useRef } from 'react';
import { getDocument } from 'pdfjs-dist';

function PdfViewer({ file }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderPDF = async () => {
      const pdfData = await file.arrayBuffer();
      const pdf = await getDocument({ data: pdfData }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
    };

    renderPDF();
  }, [file]);

  return <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }} />;
}

export default PdfViewer;
