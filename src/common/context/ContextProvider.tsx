"use client";

import { createContext, useReducer, useCallback } from "react";
import { IStationExtended } from "@/common/models/Station";

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

  const setSelectedStation = useCallback((station: IStationExtended | null) => {
    setCtx({ selectedStation: station });
  }, []);

  return (
    <Context.Provider value={{ ctx, setCtx, setSelectedStation }}>
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
