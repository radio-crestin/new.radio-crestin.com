import React from "react";
import { Metadata } from "next";
import HeaderHomepage from "@/common/components/HeaderHomepage/HeaderHomepage";
import Stations from "@/common/components/Stations/Stations";
import DownloadAppBanner from "@/common/components/DownloadAppBanner/DownloadAppBanner";
import FooterLinks from "@/common/components/FooterLinks/FooterLinks";
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

  // Add is_favorite property
  const stationsWithFavorite = stations.map((station: any) => ({
    ...station,
    is_favorite: false,
  })) as IStationExtended[];

  const cleanedStations = cleanStationsMetadata(stationsWithFavorite);

  return (
    <>
      <HeaderHomepage />
      <Stations stations={stationsWithFavorite} />
      <DownloadAppBanner />
      <FooterLinks />
    </>
  );
}

// Enable ISR with 30 seconds revalidation
export const revalidate = 30;
