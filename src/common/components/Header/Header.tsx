"use client";

import Link from "next/link";
import React, { useContext } from "react";

import styles from "./styles.module.scss";
import { Context } from "@/common/context/ContextProvider";
import Rating from "@/common/components/Rating/Rating";
import { getStationRating } from "@/common/utils";
import ShareOnSocial from "@/common/components/ShareOnSocial/ShareOnSocial";
import ThemeToggle from "@/common/components/ThemeToggle/ThemeToggle";
import WhatsAppButton from "@/common/components/WhatsAppButton/WhatsAppButton";

const Navigation = () => (
  <nav className={styles.nav}>
    <div className={styles.internal_links}>
      <Link href={"/"} className={styles.logo}>
        <img
          loading={"lazy"}
          src={"/images/radiocrestin_logo.png"}
          width={40}
          height={40}
          alt={"AppStore Image Radio Crestin"}
        />
        <h1>Radio Creștin</h1>
      </Link>
    </div>
    <div className={styles.right_content}>
      <ThemeToggle />
      <WhatsAppButton />
    </div>
  </nav>
);

const ContentLeft = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("Component must be used within ContextProvider");
  }
  const { ctx } = context;
  const { selectedStation } = ctx;

  if (!selectedStation) return null;

  const defaultImage = "/images/radiocrestin_logo.png";
  const stationImage = selectedStation?.thumbnail_url || defaultImage;
  const songImage = selectedStation.now_playing?.song?.thumbnail_url;

  return (
    <div className={styles.left_content}>
      <div className={styles.image_container}>
        <div className={styles.container_img_plus_thumb}>
          <img
            loading={"lazy"}
            src={songImage || stationImage}
            alt={selectedStation.title || "Station"}
            width={230}
            height={230}
            className={styles.main_image}
          />
          {songImage && (
            <img
              loading={"lazy"}
              src={stationImage}
              alt={selectedStation.title || "Station"}
              className={styles.img_thumb}
              width={55}
              height={55}
            />
          )}
        </div>
      </div>
      <div className={styles.station_info}>
        <h2 className={styles.station_title}>
          {selectedStation.now_playing?.song?.name || selectedStation.title || "\u00A0"}
        </h2>
        <p className={styles.station_artist}>
          {selectedStation.now_playing?.song?.artist?.name || "\u00A0"}
        </p>
      </div>
    </div>
  );
};

const ContentRight = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("Component must be used within ContextProvider");
  }
  const { ctx } = context;

  const defaultImage = "/images/radiocrestin_logo.png";
  const stationImage = ctx.selectedStation?.thumbnail_url || defaultImage;
  const stationTitle = ctx.selectedStation?.title || "Radio Creștin";
  const stationDescription = ctx.selectedStation?.description || "\u00A0";
  const totalListeners = ctx.selectedStation?.total_listeners || 0;

  return (
    <div className={styles.right_content}>
      <div className={styles.station_details}>
        <div className={styles.title_container}>
          <img
            src={stationImage}
            alt={stationTitle}
            height={100}
            width={100}
          />
          <h1 className={styles.station_title}>{stationTitle}</h1>
        </div>
        <div className={styles.rating_wrapper}>
          <Rating
            score={getStationRating(ctx.selectedStation?.reviews || [])}
            starHeight={22}
          />
          <span>({ctx.selectedStation?.reviews?.length || 0} recenzii)</span>
        </div>
        {totalListeners !== 0 ? (
          <>
            <p className={styles.nr_listeners_desktop}>
              {totalListeners} persoane ascultă împreună
              cu tine acest radio
            </p>
            <p className={styles.nr_listeners_mobile}>
              {totalListeners} ascultători
            </p>
          </>
        ) : (
          <>
            <p className={styles.nr_listeners_desktop}>\u00A0</p>
            <p className={styles.nr_listeners_mobile}>\u00A0</p>
          </>
        )}
        <p className={styles.station_description}>
          {stationDescription}
        </p>

        <div className={styles.share_on_social}>
          <ShareOnSocial />
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <>
      <header className={styles.container}>
        <Navigation />
        <div className={styles.content_section}>
          <ContentLeft />
          <ContentRight />
        </div>
      </header>
    </>
  );
};

export default Header;
