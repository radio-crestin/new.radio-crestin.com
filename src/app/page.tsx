import React from "react";
import { Metadata } from "next";
import HeaderHomepage from "@/components/HeaderHomepage";
import Stations from "@/components/Stations";
import DownloadAppBanner from "@/components/DownloadAppBanner";
import FooterLinks from "@/components/FooterLinks";
import { SEO_DEFAULT } from "@/utils/seo";
import { getStationsData } from "./actions/stations";

export const metadata: Metadata = {
  title: SEO_DEFAULT.title,
  description: SEO_DEFAULT.description,
};

export default async function HomePage() {
  // Fetch stations data on the server
  const stations = await getStationsData();

  return (
    <>
      <HeaderHomepage />
      <Stations initialStations={stations} />
      <DownloadAppBanner />
      <FooterLinks />
    </>
  );
}

// Enable ISR with 30 seconds revalidation
export const revalidate = 30;