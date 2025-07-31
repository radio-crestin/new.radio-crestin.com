"use client";

import React, { useContext, useEffect } from "react";
import { Context } from "@/common/context/ContextProvider";
import { IStationExtended } from "@/common/models/Station";
import Stations from "@/common/components/Stations/Stations";
import useFavourite from "@/common/store/useFavourite";

interface StationsWrapperProps {
  initialStations: IStationExtended[];
}

export default function StationsWrapper({ initialStations }: StationsWrapperProps) {
  const context = useContext(Context);
  const { favouriteItems } = useFavourite();

  if (!context) {
    throw new Error("StationsWrapper must be used within ContextProvider");
  }

  const { ctx, setCtx } = context;

  // Initialize context immediately on first render
  useEffect(() => {
    const favoriteStations = initialStations.filter((station) =>
      favouriteItems.includes(station.slug)
    );
    
    setCtx({
      stations: initialStations,
      favouriteStations: favoriteStations
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  // Update when stations change
  useEffect(() => {
    if (initialStations.length > 0 && JSON.stringify(initialStations) !== JSON.stringify(ctx.stations)) {
      setCtx({ stations: initialStations });
    }
  }, [initialStations, ctx.stations, setCtx]);

  // Update favorites when favouriteItems change
  useEffect(() => {
    const favoriteStations = initialStations.filter((station) =>
      favouriteItems.includes(station.slug)
    );
    if (JSON.stringify(favoriteStations) !== JSON.stringify(ctx.favouriteStations)) {
      setCtx({ favouriteStations: favoriteStations });
    }
  }, [favouriteItems, initialStations, ctx.favouriteStations, setCtx]);

  return <Stations />;
}