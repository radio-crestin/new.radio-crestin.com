"use client";

import { createContext, useReducer, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IStationExtended } from "@/common/models/Station";
import { getStations } from "@/common/services/getStations";
import { Bugsnag } from "@/common/utils/bugsnag";

interface ContextState {
  stations: IStationExtended[];
  selectedStation: IStationExtended | null;
  favouriteStations: IStationExtended[];
  stationGroups: any[];
}

interface ContextValue {
  ctx: ContextState;
  setCtx: (newState: Partial<ContextState>) => void;
  setSelectedStation: (station: IStationExtended | null) => void;
}

const Context = createContext<ContextValue | null>(null);

function isObject(item: any) {
  return item && typeof item === "object" && !Array.isArray(item);
}

function deepMerge(obj1: any, obj2: any) {
  let output = { ...obj1 };

  Object.keys(obj2).forEach((key) => {
    if (isObject(obj2[key]) && isObject(obj1[key])) {
      output[key] = deepMerge(obj1[key], obj2[key]);
    } else {
      output[key] = obj2[key];
    }
  });

  return output;
}

const reducer = (ctx: any, newCtx: any) => {
  return deepMerge(ctx, newCtx);
};

const initialState: ContextState = {
  stations: [],
  selectedStation: null,
  favouriteStations: [],
  stationGroups: [],
};

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [ctx, setCtx] = useReducer(reducer, initialState);
  const pathname = usePathname();

  const setSelectedStation = useCallback((station: IStationExtended | null) => {
    setCtx({ selectedStation: station });
  }, []);

  // Auto-refresh stations every 10 seconds with smart updates
  useEffect(() => {
    const fetchStationsData = async () => {
      try {
        const data = await getStations();
        if (data?.stations && data?.stations.length > 0) {
          // Only update if stations data has actually changed
          setCtx((prevCtx: ContextState) => {
            const newStations = data.stations;
            
            // Quick check: if lengths are different, definitely update
            if (prevCtx.stations.length !== newStations.length) {
              return { stations: newStations };
            }
            
            // Check if any station data has actually changed
            const hasChanges = newStations.some((newStation: IStationExtended, index: number) => {
              const prevStation = prevCtx.stations[index];
              if (!prevStation) return true;
              
              // Compare key fields that affect playback or display
              return (
                prevStation.id !== newStation.id ||
                prevStation.slug !== newStation.slug ||
                prevStation.title !== newStation.title ||
                JSON.stringify(prevStation.now_playing) !== JSON.stringify(newStation.now_playing) ||
                JSON.stringify(prevStation.station_streams) !== JSON.stringify(newStation.station_streams) ||
                prevStation.thumbnail_url !== newStation.thumbnail_url ||
                JSON.stringify(prevStation.uptime) !== JSON.stringify(newStation.uptime)
              );
            });
            
            // Only update if there are actual changes
            if (hasChanges) {
              return { stations: newStations };
            }
            
            // No changes, return previous context unchanged
            return prevCtx;
          });
        }
      } catch (error) {
        Bugsnag.notify(
          new Error(
            `Failed to fetch stations - error: ${JSON.stringify(
              error,
              null,
              2,
            )}`,
          ),
        );
      }
    };

    fetchStationsData();
    const intervalId = setInterval(fetchStationsData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Update selected station based on pathname with smart comparison
  useEffect(() => {
    const station_slug = pathname?.split('/')[1];
    if (station_slug && ctx?.stations && ctx.stations.length > 0) {
      const newSelectedStation = ctx.stations.find(
        (s: IStationExtended) => s.slug === station_slug,
      );

      if (newSelectedStation) {
        // Only update if the selected station has actually changed or is different
        const currentSelected = ctx.selectedStation;
        const shouldUpdate = !currentSelected || 
          currentSelected.id !== newSelectedStation.id ||
          currentSelected.slug !== newSelectedStation.slug ||
          JSON.stringify(currentSelected.now_playing) !== JSON.stringify(newSelectedStation.now_playing) ||
          JSON.stringify(currentSelected.station_streams) !== JSON.stringify(newSelectedStation.station_streams) ||
          currentSelected.thumbnail_url !== newSelectedStation.thumbnail_url;

        if (shouldUpdate) {
          setCtx({ selectedStation: newSelectedStation });
        }
      }
    }
  }, [pathname, ctx.stations, ctx.selectedStation]);

  return (
    <Context.Provider value={{ ctx, setCtx, setSelectedStation }}>
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
