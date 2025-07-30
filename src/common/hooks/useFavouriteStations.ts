"use client";

import { useContext, useEffect } from "react";
import { IStation } from "@/common/models/Station";
import { Context } from "@/common/context/ContextProvider";
import useFavourite from "@/common/store/useFavourite";

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
    });
  }, [favouriteItems, ctx.stations]);
};

export default useFavouriteStations;
