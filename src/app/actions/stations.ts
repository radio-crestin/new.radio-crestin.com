"use server";

import { revalidatePath } from "next/cache";
import { getStations, getStationsList } from "@/services/getStations";
import { IStationExtended } from "@/models/Station";
import { cleanStationsMetadata } from "@/utils";

export async function refreshStations() {
  revalidatePath("/");
  revalidatePath("/[station_slug]", "page");
}

export async function getStationsData() {
  const { stations } = await getStationsList();
  
  // Add is_favorite property to each station
  const stationsWithFavorite = stations.map((station) => ({
    ...station,
    is_favorite: false,
  })) as IStationExtended[];
  
  return cleanStationsMetadata(stationsWithFavorite);
}

export async function getStationBySlug(slug: string) {
  const { stations } = await getStations();
  
  // Add is_favorite property to each station
  const stationsWithFavorite = stations.map((station) => ({
    ...station,
    is_favorite: false,
  })) as IStationExtended[];
  
  const stationData = stationsWithFavorite.find(
    (station) => station.slug === slug
  );
  
  if (!stationData) {
    return null;
  }
  
  const stations_without_meta = cleanStationsMetadata(stationsWithFavorite);
  const selectedStationIndex = stations_without_meta.findIndex(
    (s) => s.slug === slug
  );
  const selectedStation = stations_without_meta[selectedStationIndex];
  
  return {
    stations: stations_without_meta,
    selectedStation,
  };
}