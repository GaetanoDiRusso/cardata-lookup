import { useState, useEffect, useCallback } from 'react';

interface ScrapingJobStatus {
  jobId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: string;
  data?: any;
  mediaUrls?: {
    images: string[];
    pdfs: string[];
    videos: string[];
  };
  error?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseScrapingJobOptions {
  folderId: string;
  scrapingType: string;
  autoReconnect?: boolean;
  pollInterval?: number;
}

export const useScrapingJob = ({ 
  folderId, 
  scrapingType, 
  autoReconnect = true, 
  pollInterval = 2000 
}: UseScrapingJobOptions) => {
  const [status, setStatus] = useState<ScrapingJobStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  // Generate a unique key for localStorage
  const storageKey = `scraping_job_${folderId}_${scrapingType}`;

  // Load initial state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStatus(parsed);
      } catch (e) {
        console.error('Failed to parse saved scraping job state:', e);
      }
    }
  }, [storageKey]);

  // Save state to localStorage
  const saveState = useCallback((newStatus: ScrapingJobStatus | null) => {
    if (newStatus) {
      localStorage.setItem(storageKey, JSON.stringify(newStatus));
    } else {
      localStorage.removeItem(storageKey);
    }
    setStatus(newStatus);
  }, [storageKey]);

  // Start real-time monitoring
  const startMonitoring = useCallback((jobId: string) => {
    if (eventSource) {
      eventSource.close();
    }

    const sse = new EventSource(`/api/testing/scraping/status/${jobId}`);
    
    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          setError(data.error);
          sse.close();
        } else {
          saveState(data);
          setError(null);
        }
      } catch (e) {
        console.error('Failed to parse SSE message:', e);
      }
    };

    sse.onerror = () => {
      console.error('SSE connection error');
      sse.close();
      if (autoReconnect) {
        setTimeout(() => startMonitoring(jobId), 5000);
      }
    };

    setEventSource(sse);
  }, [eventSource, autoReconnect, saveState]);

  // Start a new scraping job
  const startJob = useCallback(async (vehicleData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/testing/scraping/infracciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderId,
          vehicleData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start scraping job');
      }

      const result = await response.json();
      
      // Start monitoring the job
      startMonitoring(result.jobId);
      
      return result;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      setError(errorMessage);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [folderId, startMonitoring]);

  // Check if there's an existing job for this folder/type
  const checkExistingJob = useCallback(async () => {
    try {
      const response = await fetch(`/api/testing/scraping/infracciones?folderId=${folderId}`);
      
      if (response.ok) {
        const existingStatus = await response.json();
        saveState(existingStatus);
        
        // If job is still in progress, start monitoring
        if (existingStatus.status === 'pending' || existingStatus.status === 'in_progress') {
          startMonitoring(existingStatus.jobId);
        }
        
        return existingStatus;
      }
    } catch (e) {
      console.error('Failed to check existing job:', e);
    }
    
    return null;
  }, [folderId, saveState, startMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  // Check for existing job on mount
  useEffect(() => {
    checkExistingJob();
  }, [checkExistingJob]);

  return {
    status,
    isLoading,
    error,
    startJob,
    checkExistingJob,
    isCompleted: status?.status === 'completed',
    isFailed: status?.status === 'failed',
    isInProgress: status?.status === 'in_progress' || status?.status === 'pending',
  };
}; 