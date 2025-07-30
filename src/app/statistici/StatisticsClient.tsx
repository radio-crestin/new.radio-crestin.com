"use client";

import React from "react";
import Link from "next/link";
import { IStationExtended } from "@/common/models/Station";
import styles from "./page.module.scss";

interface StatisticsClientProps {
  stations: IStationExtended[];
}

export default function StatisticsClient({ stations }: StatisticsClientProps) {
  const sortedStations = [...stations].sort(
    (a, b) => (b.radio_crestin_listeners || 0) - (a.radio_crestin_listeners || 0)
  );

  const totalListeners = sortedStations.reduce(
    (total, station) => total + (station.radio_crestin_listeners || 0),
    0
  );

  return (
    <>
      {sortedStations.map((station) => (
        <Link
          href={`/${station.slug}`}
          key={station.id}
          className={styles.station_item}
        >
          <span className={styles.station_name}>{station.title}</span>
          <span className={styles.listeners_count}>
            {station.radio_crestin_listeners || 0} ascultători
          </span>
        </Link>
      ))}
      <div className={styles.total_listeners}>
        🎧 Total Ascultători: {totalListeners}
      </div>
    </>
  );
}