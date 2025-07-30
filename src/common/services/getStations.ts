"use server";
import { Bugsnag } from "@/utils/bugsnag";
import { graphqlClient } from "@/graphql/client";
import { GET_STATIONS_QUERY, GET_STATIONS_LIST_QUERY, GET_STATION_DETAIL_QUERY } from "@/graphql/queries";
import { GetStationsQuery, GetStationsListQuery, GetStationDetailQuery } from "@/lib/graphql";
import { cache } from "react";

// Cache the full stations query for 30 seconds
export const getStations = cache(async () => {
  try {
    const data = await graphqlClient.request<GetStationsQuery>(
      GET_STATIONS_QUERY,
      {},
      {
        next: {
          revalidate: 30, // Cache for 30 seconds
        },
      }
    );
    
    return {
      stations: data.stations || [],
      station_groups: data.station_groups || [],
    };
  } catch (error) {
    Bugsnag.notify(
      new Error("Getting stations error: " + JSON.stringify(error, null, 2))
    );
    console.error("Error fetching stations:", error);
    return { stations: [], station_groups: [] };
  }
});

// Lightweight query for listing pages
export const getStationsList = cache(async () => {
  try {
    const data = await graphqlClient.request<GetStationsQuery>(
      GET_STATIONS_LIST_QUERY,
      {},
      {
        next: {
          revalidate: 30, // Cache for 30 seconds
        },
      }
    );
    
    return {
      stations: data.stations || [],
      station_groups: data.station_groups || [],
    };
  } catch (error) {
    Bugsnag.notify(
      new Error("Getting stations list error: " + JSON.stringify(error, null, 2))
    );
    console.error("Error fetching stations list:", error);
    return { stations: [], station_groups: [] };
  }
});

// Get a specific station by slug
export const getStationBySlug = cache(async (slug: string) => {
  try {
    const data = await graphqlClient.request<GetStationDetailQuery>(
      GET_STATION_DETAIL_QUERY,
      {},
      {
        next: {
          revalidate: 30, // Cache for 30 seconds
        },
      }
    );
    
    // Since we can't filter by slug in the query, we need to find it client-side
    return data.stations?.find((station) => station.slug === slug) || null;
  } catch (error) {
    Bugsnag.notify(
      new Error("Getting station by slug error: " + JSON.stringify(error, null, 2))
    );
    console.error("Error fetching station by slug:", error);
    return null;
  }
});
