import { useEffect, useState, useRef } from 'react';
import { getStations } from '@/common/services/getStations';
import { IStationExtended } from '@/common/models/Station';

interface UseStationsRefreshReturn {
  stations: IStationExtended[];
  isLoading: boolean;
  error: string | null;
}

export const useStationsRefresh = (initialStations: IStationExtended[]): UseStationsRefreshReturn => {
  const [stations, setStations] = useState<IStationExtended[]>(initialStations);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refreshStations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getStations();
      if(!data.stations || data.stations.length === 0) {
        throw new Error('No stations found in the response');
      }
      setStations(data.stations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStations();

    // Start the interval to refresh stations every 10 seconds
    intervalRef.current = setInterval(refreshStations, 10000);

    // Cleanup function to clear the interval
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update stations when initialStations prop changes
  useEffect(() => {
    setStations(initialStations);
  }, [initialStations]);

  return {
    stations,
    isLoading,
    error,
  };
};
