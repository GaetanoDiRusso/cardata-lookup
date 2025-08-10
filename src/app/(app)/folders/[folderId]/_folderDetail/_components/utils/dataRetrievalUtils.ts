import { PVehicleDataRetrieval } from '@/models/PScrapingResult';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'failed':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'in_progress':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return '✓';
    case 'failed':
      return '✗';
    case 'in_progress':
      return '⏳';
    default:
      return '○';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completado';
    case 'failed':
      return 'Fallido';
    case 'in_progress':
      return 'En progreso';
    default:
      return 'Pendiente';
  }
};

export const getAvailableMedia = (retrieval: PVehicleDataRetrieval) => {
  const mediaTypes = [];
  
  // Check for PDFs
  if (retrieval.pdfUrls && retrieval.pdfUrls.length > 0) {
    mediaTypes.push({
      type: 'pdf',
      label: 'Ver PDF',
      icon: '📄',
      count: retrieval.pdfUrls.length
    });
  }
  
  // Check for images
  if (retrieval.imageUrls && retrieval.imageUrls.length > 0) {
    mediaTypes.push({
      type: 'image',
      label: 'Ver Imagen',
      icon: '🖼️',
      count: retrieval.imageUrls.length
    });
  }
  
  // Check for videos
  if (retrieval.videoUrls && retrieval.videoUrls.length > 0) {
    mediaTypes.push({
      type: 'video',
      label: 'Ver Video',
      icon: '🎥',
      count: retrieval.videoUrls.length
    });
  }
  
  return mediaTypes;
};

export const getFileLabel = (mediaType: 'pdf' | 'image' | 'video', index: number, totalCount: number) => {
  const baseLabel = mediaType === 'pdf' ? 'PDF' : 
                   mediaType === 'image' ? 'Imagen' : 
                   'Video';
  
  if (totalCount === 1) {
    return baseLabel;
  }
  
  return `${baseLabel} ${index + 1}`;
};

export const handleViewMedia = (mediaType: 'pdf' | 'image' | 'video', retrieval: PVehicleDataRetrieval, index: number = 0) => {
  let mediaUrl: string | undefined;
  
  switch (mediaType) {
    case 'pdf':
      mediaUrl = retrieval.pdfUrls?.[index];
      break;
    case 'image':
      mediaUrl = retrieval.imageUrls?.[index];
      break;
    case 'video':
      mediaUrl = retrieval.videoUrls?.[index];
      break;
    default:
      mediaUrl = undefined;
  }

  if (mediaUrl) {
    if (mediaType === 'pdf') {
      // Use our PDF viewer endpoint to force inline display
      const timestamp = Date.now();
      const pdfViewerUrl = `/api/pdf-viewer?url=${encodeURIComponent(mediaUrl)}&t=${timestamp}`;
      
      // Open the PDF viewer endpoint directly in new tab
      window.open(pdfViewerUrl, '_blank');
    } else {
      // For images and videos, open directly in new tab
      window.open(mediaUrl, '_blank');
    }
  }
}; 