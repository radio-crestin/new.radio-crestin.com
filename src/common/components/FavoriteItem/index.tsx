"use client";

import Link from "next/link";

import { IStation } from "@/models/Station";
import styles from "./styles.module.scss";
import useFavourite from "@/store/useFavourite";
import React, { useContext, useEffect, useState } from "react";
import Heart from "@/icons/Heart";
import { Context } from "@/context/ContextProvider";

const FavouriteItem = (data: IStation) => {
  const context = useContext(Context);
  const { favouriteItems, toggleFavourite } = useFavourite();
  const [isStationFavourite, setIsStationFavourite] = useState(false);
  
  if (!context) {
    throw new Error("FavouriteItem must be used within ContextProvider");
  }
  
  const { ctx } = context;
  const isActive = ctx.selectedStation?.slug === data.slug;

  useEffect(() => {
    setIsStationFavourite(favouriteItems.includes(data.slug));
  }, [data.slug, favouriteItems]);

  return (
    <Link
      className={styles.station_item}
      href={data.slug}
      scroll={false}
      data-active={isActive}
      draggable={false}
    >
      <div className={styles.image_container}>
        <img
          src={data.thumbnail_url}
          alt={`${data.title} | radiocrestin.ro`}
          loading={"lazy"}
          height={100}
          width={100}
        />
        <div className={styles.station_details}>
          <p className={styles.station_name}>{data.title}</p>
          <p className={styles.song_name}>
            {data?.now_playing?.[0]?.song?.name}
            {data?.now_playing?.[0]?.song?.artist?.name && (
              <span className={styles.artist_name}>
                {" · "}
                {data?.now_playing?.[0]?.song?.artist?.name}
              </span>
            )}
          </p>
        </div>
      </div>
      <div
        className={styles.favourite_heart_container}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleFavourite(data.slug);
        }}
      >
        <Heart color={"red"} />
      </div>
    </Link>
  );
};

export default FavouriteItem;
