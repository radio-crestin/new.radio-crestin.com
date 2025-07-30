"use client";

import React, { useContext, useEffect } from "react";
import { Context } from "@/context/ContextProvider";
import { IStationExtended } from "@/models/Station";
import RadioPlayer from "@/components/RadioPlayer";

interface StationContextProviderProps {
  selectedStation: IStationExtended;
  stationSlug: string;
  children: React.ReactNode;
}

export default function StationContextProvider({
  selectedStation,
  stationSlug,
  children,
}: StationContextProviderProps) {
  const context = useContext(Context);
  
  if (!context) {
    throw new Error("StationContextProvider must be used within ContextProvider");
  }
  
  const { ctx, setSelectedStation } = context;

  useEffect(() => {
    // Set the selected station in context
    setSelectedStation(selectedStation);
  }, [selectedStation, setSelectedStation]);

  return (
    <>
      {children}
      {ctx.selectedStation && <RadioPlayer />}
    </>
  );
}