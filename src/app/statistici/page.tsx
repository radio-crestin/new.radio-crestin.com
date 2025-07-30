import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SEO_STATISTICI } from "@/common/utils/seo";
import { getStationsData } from "../actions/stations";
import StatisticsClient from "./StatisticsClient";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: SEO_STATISTICI.title,
  description: SEO_STATISTICI.description,
  keywords: SEO_STATISTICI.keywords?.split(","),
  authors: SEO_STATISTICI.author ? [SEO_STATISTICI.author] : undefined,
  openGraph: {
    title: SEO_STATISTICI.openGraph.title,
    description: SEO_STATISTICI.openGraph.description,
    url: SEO_STATISTICI.openGraph.url,
    siteName: SEO_STATISTICI.openGraph.site_name,
    images: SEO_STATISTICI.openGraph.images,
    locale: SEO_STATISTICI.openGraph.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_STATISTICI.twitter.title,
    description: SEO_STATISTICI.twitter.description,
    images: SEO_STATISTICI.twitter.images,
  },
  alternates: {
    canonical: SEO_STATISTICI.canonical,
  },
};

export default async function StatisticiPage() {
  const stations = await getStationsData();

  return (
    <div className={styles.container}>
      <div className={styles.all_stations}>
        <Link href={"/"} className={styles.back_link}>
          <span>←</span> Inapoi
        </Link>
        <StatisticsClient stations={stations} />
        <p className={styles.info_text}>
          (radio-crestin.com / radiocrestin.ro / Radio Crestin mobile apps)
        </p>
      </div>
    </div>
  );
}

export const revalidate = 30;