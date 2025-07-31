import { GraphQLClient } from 'graphql-request';
import {
  GET_STATIONS_QUERY_STRING
} from "@/common/graphql/queryStrings";

export const getStations = async () => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "";
    const client = new GraphQLClient(endpoint, {
      mode: 'no-cors'
    });
    
    const data = await client.request<any>(GET_STATIONS_QUERY_STRING);

    return {
      stations: data.stations || [],
      station_groups: data.station_groups || [],
    };
  } catch (error) {
    console.error("Error fetching stations:", error);
    return { stations: [], station_groups: [] };
  }
};

