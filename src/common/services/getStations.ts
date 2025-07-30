"use server";
// Remove Bugsnag import for server-side code
import { cache } from "react";
import { graphqlFetch } from "./graphqlFetch";
import {
  GET_STATIONS_QUERY_STRING
} from "@/common/graphql/queryStrings";

// Cache the full stations query for 30 seconds
export const getStations = cache(async () => {
  try {
    const data = await graphqlFetch<any>(
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

