"use server";
// Remove Bugsnag import for server-side code
import { GetStationsQuery, GetStationsListQuery, GetStationDetailQuery } from "@/lib/graphql/graphql";
import { cache } from "react";
import { graphqlFetch } from "./graphqlFetch";
import { 
  GET_STATIONS_QUERY_STRING, 
  GET_STATIONS_LIST_QUERY_STRING, 
  GET_STATION_DETAIL_QUERY_STRING 
} from "@/common/graphql/queryStrings";

// Cache the full stations query for 30 seconds
export const getStations = cache(async () => {
  try {
    const data = await graphqlFetch<GetStationsQuery>(
      GET_STATIONS_QUERY_STRING,
      {}
    );
    
    return {
      stations: data.stations || [],
      station_groups: data.station_groups || [],
    };
  } catch (error) {
    console.error("Getting stations error:", error);
    console.error("Error fetching stations:", error);
    return { stations: [], station_groups: [] };
  }
});

// Lightweight query for listing pages
export const getStationsList = cache(async () => {
  try {
    const data = await graphqlFetch<GetStationsListQuery>(
      GET_STATIONS_LIST_QUERY_STRING,
      {}
    );
    
    return {
      stations: data.stations || [],
      station_groups: data.station_groups || [],
    };
  } catch (error) {
    console.error("Getting stations list error:", error);
    console.error("Error fetching stations list:", error);
    return { stations: [], station_groups: [] };
  }
});

// Get a specific station by slug
export const getStationBySlug = cache(async (slug: string) => {
  try {
    const data = await graphqlFetch<GetStationDetailQuery>(
      GET_STATION_DETAIL_QUERY_STRING,
      {}
    );
    
    // Since we can't filter by slug in the query, we need to find it client-side
    return data.stations?.find((station) => station.slug === slug) || null;
  } catch (error) {
    console.error("Getting station by slug error:", error);
    console.error("Error fetching station by slug:", error);
    return null;
  }
});
