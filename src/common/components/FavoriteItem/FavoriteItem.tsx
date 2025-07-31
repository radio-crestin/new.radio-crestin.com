"use client";

import Link from "next/link";

import { IStation, IStationExtended } from "@/common/models/Station";
import styles from "./styles.module.scss";
import useFavourite from "@/common/store/useFavourite";
import useStation from "@/common/store/useStation";
import React, { useEffect, useState } from "react";
import Heart from "@/icons/Heart";

const FavouriteItem = (data: IStation) => {
  const { favouriteItems, toggleFavourite } = useFavourite();
  const { currentStation, allStations, setCurrentStation } = useStation();
  const [isStationFavourite, setIsStationFavourite] = useState(false);
  
  const isActive = currentStation?.slug === data.slug;

  useEffect(() => {
    setIsStationFavourite(favouriteItems.includes(data.slug));
  }, [data.slug, favouriteItems]);

  const handleStationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const station = allStations.find(s => s.slug === data.slug);
    if (station) {
      setCurrentStation(station);
      window.history.pushState({}, '', `/${data.slug}`);
    }
  };

  return (
    <Link
      className={styles.station_item}
      href={data.slug}
      scroll={false}
      data-active={isActive}
      draggable={false}
      onClick={handleStationClick}
    >
      <div className={styles.image_container}>
        <img
          src={data.thumbnail_url || ""}
          alt={`${data.title} | radiocrestin.ro`}
          loading={"lazy"}
          height={100}
          width={100}
        />
        <div className={styles.station_details}>
          <p className={styles.station_name}>{data.title}</p>
          <p className={styles.song_name}>
            {data?.now_playing?.song?.name}
            {data?.now_playing?.song?.artist?.name && (
              <span className={styles.artist_name}>
                {" · "}
                {data?.now_playing?.song?.artist?.name}
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
