"use client";

import { useContext, useEffect } from "react";
import { IStation } from "@/models/Station";
import { Context } from "@/context/ContextProvider";
import useFavourite from "@/store/useFavourite";

const useFavouriteStations = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useFavouriteStations must be used within ContextProvider");
  }
  const { ctx, setCtx } = context;
  const { favouriteItems } = useFavourite();
  useEffect(() => {
    const favouriteStations: Array<IStation | any> =
      favouriteItems
        .map((slug: string) => {
          const foundStation = ctx.stations?.find(
            (station: IStation) => station.slug === slug,
          );
          return foundStation ? foundStation : null;
        })
        .filter((station) => station !== null) || [];
    setCtx({
      favouriteStations: favouriteStations,
      isFavouriteStationsLoaded: true,
    });
  }, [favouriteItems, ctx.stations]);
};

export default useFavouriteStations;
