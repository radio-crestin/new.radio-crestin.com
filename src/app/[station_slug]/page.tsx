import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/common/components/Header";
import Stations from "@/common/components/Stations";
import DownloadAppBanner from "@/common/components/DownloadAppBanner";
import FooterLinks from "@/common/components/FooterLinks";
import { seoStation } from "@/common/utils/seo";
import { getStationBySlug, getStationsData } from "../actions/stations";
import { getStations } from "@/common/services/getStations";
import StationContextProvider from "./StationContextProvider";
import type { IStation } from "@/common/models/Station";

interface StationPageProps {
  params: Promise<{
    station_slug: string;
  }>;
}

export async function generateStaticParams() {
  const { stations } = await getStations();
  
  return stations.map((station) => ({
    station_slug: station.slug,
  }));
}

export async function generateMetadata({
  params,
}: StationPageProps): Promise<Metadata> {
  const { station_slug } = await params;
  const data = await getStationBySlug(station_slug);
  
  if (!data) {
    return {};
  }
  
  const seo = seoStation(data.selectedStation);
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.split(","),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.fullURL,
      siteName: "Radio Creștin",
      images: [
        {
          url: seo.imageUrl,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: "ro_RO",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.imageUrl],
    },
    alternates: {
      canonical: seo.fullURL,
    },
  };
}

export default async function StationPage({ params }: StationPageProps) {
  const { station_slug } = await params;
  const data = await getStationBySlug(station_slug);
  
  if (!data) {
    notFound();
  }
  
  return (
    <StationContextProvider
      selectedStation={data.selectedStation}
      stationSlug={station_slug}
    >
      <Header />
      <Stations initialStations={data.stations} />
      <DownloadAppBanner />
      <FooterLinks />
    </StationContextProvider>
  );
}

// Enable ISR with 30 seconds revalidation
export const revalidate = 30;
