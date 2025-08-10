'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PDFViewerPage() {
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get('url');
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string>('');

  useEffect(() => {
    if (pdfUrl) {
      const timestamp = Date.now();
      const viewerUrl = `/api/pdf-viewer?url=${encodeURIComponent(pdfUrl)}&t=${timestamp}`;
      setPdfViewerUrl(viewerUrl);
    }
  }, [pdfUrl]);

  if (!pdfUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">PDF Viewer</h1>
          <p className="text-gray-600">No PDF URL provided</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">PDF Viewer</h1>
            <p className="text-sm text-gray-600 mt-1">Viewing PDF document</p>
          </div>
          <div className="h-[calc(100vh-120px)]">
            {pdfViewerUrl && (
              <iframe
                src={pdfViewerUrl}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 