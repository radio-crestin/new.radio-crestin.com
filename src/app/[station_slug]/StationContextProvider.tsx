"use client";

import React, { useContext, useEffect } from "react";
import { Context } from "@/common/context/ContextProvider";
import { IStationExtended } from "@/common/models/Station";
import RadioPlayer from "@/common/components/RadioPlayer/RadioPlayer";
import useFavourite from "@/common/store/useFavourite";

interface StationContextProviderProps {
  stations: IStationExtended[];
  selectedStation: IStationExtended;
  stationSlug: string;
  children: React.ReactNode;
}

export default function StationContextProvider({
  stations,
  selectedStation,
  stationSlug,
  children,
}: StationContextProviderProps) {
  const context = useContext(Context);
  const { favouriteItems } = useFavourite();

  if (!context) {
    throw new Error("StationContextProvider must be used within ContextProvider");
  }

  const { ctx, setSelectedStation, setCtx } = context;

  // Initialize context immediately (synchronously) on first render
  useEffect(() => {
    // Set all data in one update to avoid multiple renders
    const favoriteStations = stations.filter((station) =>
      favouriteItems.includes(station.slug)
    );
    
    setCtx({
      stations,
      selectedStation,
      favouriteStations: favoriteStations
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  // Update when selectedStation changes
  useEffect(() => {
    if (selectedStation?.id !== ctx.selectedStation?.id) {
      setSelectedStation(selectedStation);
    }
  }, [selectedStation, ctx.selectedStation, setSelectedStation]);

  // Update when stations change
  useEffect(() => {
    if (stations.length > 0 && JSON.stringify(stations) !== JSON.stringify(ctx.stations)) {
      setCtx({ stations });
    }
  }, [stations, ctx.stations, setCtx]);

  // Update favorites when favouriteItems change
  useEffect(() => {
    const favoriteStations = stations.filter((station) =>
      favouriteItems.includes(station.slug)
    );
    if (JSON.stringify(favoriteStations) !== JSON.stringify(ctx.favouriteStations)) {
      setCtx({ favouriteStations: favoriteStations });
    }
  }, [favouriteItems, stations, ctx.favouriteStations, setCtx]);

  return (
    <>
      {children}
      {ctx.selectedStation && <RadioPlayer />}
    </>
  );
}
