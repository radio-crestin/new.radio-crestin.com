"use client";

import Link from "next/link";

import { IStation, IStationExtended } from "@/common/models/Station";
import styles from "./styles.module.scss";
import HeadphoneIcon from "@/icons/Headphone";
import Heart from "@/icons/Heart";
import useFavourite from "@/common/store/useFavourite";
import useStation from "@/common/store/useStation";
import { useEffect, useState } from "react";

const StationItem = (data: IStation) => {
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
      data-station={"station-item"}
      data-active={isActive}
      href={data.slug}
      scroll={false}
      draggable={false}
      onClick={handleStationClick}
    >
      <div className={styles.image_container}>
        {(data.now_playing?.song?.thumbnail_url || data?.thumbnail_url) && (
          <img
            src={data.now_playing?.song?.thumbnail_url || data?.thumbnail_url || ""}
            alt={`${data.title} | radiocrestin.ro`}
            loading={"lazy"}
            height={110}
            width={110}
          />
        )}
      </div>
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
      {(data?.total_listeners || 0) > 0 && (
        <div className={styles.total_listeners}>
          {data?.total_listeners} <HeadphoneIcon />
        </div>
      )}
      <div
        className={styles.favourite_heart_container}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleFavourite(data.slug);
        }}
      >
        <Heart color={isStationFavourite ? "red" : "white"} />
      </div>
    </Link>
  );
};

export default StationItem;
