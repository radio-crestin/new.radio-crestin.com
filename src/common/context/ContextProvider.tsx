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

  // Auto-refresh stations every 10 seconds
  useEffect(() => {
    const fetchStationsData = async () => {
      try {
        const data = await getStations();
        if (data?.stations && data?.stations.length > 0) {
          setCtx({
            stations: data.stations,
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

  // Update selected station based on pathname
  useEffect(() => {
    const station_slug = pathname?.split('/')[1];
    if (station_slug && ctx?.stations) {
      const selectedStationIndex = ctx.stations.findIndex(
        (s: IStationExtended) => s.slug === station_slug,
      );

      if (selectedStationIndex !== -1) {
        setCtx({
          selectedStation: ctx.stations[selectedStationIndex],
        });
      }
    }
  }, [pathname, ctx.stations]);

  return (
    <Context.Provider value={{ ctx, setCtx, setSelectedStation }}>
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
