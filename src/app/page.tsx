import React from "react";
import { Metadata } from "next";
import HeaderHomepage from "@/common/components/HeaderHomepage";
import Stations from "@/common/components/Stations";
import DownloadAppBanner from "@/common/components/DownloadAppBanner";
import FooterLinks from "@/common/components/FooterLinks";
import { SEO_DEFAULT } from "@/common/utils/seo";
import { getStations } from "@/common/services/getStations";
import { cleanStationsMetadata } from "@/common/utils";
import type { IStationExtended } from "@/common/models/Station";

export const metadata: Metadata = {
  title: SEO_DEFAULT.title,
  description: SEO_DEFAULT.description,
};

export default async function HomePage() {
  // Fetch stations data on the server
  const { stations } = await getStations();
  
  // Add is_favorite property and convert arrays
  const stationsWithFavorite = stations.map((station: any) => ({
    ...station,
    is_favorite: false,
    now_playing: station.now_playing ? [station.now_playing] : [],
    uptime: station.uptime ? [station.uptime] : [],
  })) as IStationExtended[];
  
  const cleanedStations = cleanStationsMetadata(stationsWithFavorite);

  return (
    <>
      <HeaderHomepage />
      <Stations initialStations={cleanedStations} />
      <DownloadAppBanner />
      <FooterLinks />
    </>
  );
}

// Enable ISR with 30 seconds revalidation
export const revalidate = 30;