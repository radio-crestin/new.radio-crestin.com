"use client";

import Link from "next/link";
import React, { useContext } from "react";

import styles from "./styles.module.scss";
import { Context } from "@/common/context/ContextProvider";
import Rating from "@/common/components/Rating";
import { getStationRating } from "@/common/utils";
import ShareOnSocial from "@/common/components/ShareOnSocial";
import ThemeToggle from "@/common/components/ThemeToggle";
import WhatsAppButton from "@/common/components/WhatsAppButton";

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

  return (
    <div className={styles.left_content}>
      {ctx.selectedStation && (
        <>
          {selectedStation.now_playing?.[0]?.song?.thumbnail_url ? (
            <div className={styles.container_img_plus_thumb}>
              <img
                loading={"lazy"}
                src={selectedStation.now_playing?.[0]?.song?.thumbnail_url}
                alt={selectedStation.title}
                width={230}
                height={230}
              />
              {selectedStation?.thumbnail_url && (
                <img
                  loading={"lazy"}
                  src={selectedStation.thumbnail_url}
                  alt={selectedStation.title}
                  className={styles.img_thumb}
                  width={230}
                  height={230}
                />
              )}
            </div>
          ) : (
            selectedStation?.thumbnail_url && (
              <img
                loading={"lazy"}
                src={selectedStation.thumbnail_url}
                alt={selectedStation.title}
                width={230}
                height={230}
              />
            )
          )}
          <div className={styles.station_info}>
            <h2 className={styles.station_title}>
              {selectedStation.now_playing?.[0]?.song?.name || selectedStation.title}
            </h2>
            <p className={styles.station_artist}>
              {selectedStation.now_playing?.[0]?.song?.artist?.name}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const ContentRight = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("Component must be used within ContextProvider");
  }
  const { ctx } = context;

  return (
    <div className={styles.right_content}>
      <div className={styles.station_details}>
        <div className={styles.title_container}>
          {ctx.selectedStation?.thumbnail_url && (
            <img
              src={ctx.selectedStation.thumbnail_url}
              alt="Radio Crestin"
              height={100}
              width={100}
            />
          )}
          <h1 className={styles.station_title}>{ctx.selectedStation?.title}</h1>
        </div>
        <div className={styles.rating_wrapper}>
          <Rating
            score={getStationRating(ctx.selectedStation?.reviews || [])}
            starHeight={22}
          />
          <span>({ctx.selectedStation?.reviews?.length || 0} recenzii)</span>
        </div>
        {ctx.selectedStation?.total_listeners !== 0 && (
          <>
            <p className={styles.nr_listeners_desktop}>
              {ctx.selectedStation?.total_listeners} persoane ascultă împreună
              cu tine acest radio
            </p>
            <p className={styles.nr_listeners_mobile}>
              {ctx.selectedStation?.total_listeners} ascultători
            </p>
          </>
        )}
        <p className={styles.station_description}>
          {ctx.selectedStation?.description}
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
