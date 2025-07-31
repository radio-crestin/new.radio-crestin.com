import { graphqlFetch } from "./graphqlFetch";
import {
  GET_STATIONS_QUERY_STRING
} from "@/common/graphql/queryStrings";

export const getStations = async () => {
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
    console.error("Error fetching stations:", error);
    return { stations: [], station_groups: [] };
  }
};

