"use server";
import { CONSTANTS } from "@/constants/constants";
import { Bugsnag } from "@/utils/bugsnag";

const query = `
   query GetStations @cache_control(max_age: 30, max_stale: 30, stale_while_revalidate: 5) @cached(ttl: 0) {
  stations(order_by: {order: asc}) {
    id
    order
    title
    website
    slug
    email
    stream_url
    proxy_stream_url
    hls_stream_url
    thumbnail_url
    total_listeners
    radio_crestin_listeners
    description
    description_action_title
    description_link
    feature_latest_post
    station_streams {
      type
      stream_url
    }
    posts(limit: 1, order_by: {published: desc}) {
      id
      title
      description
      link
      published
    }
    uptime {
      is_up
      latency_ms
      timestamp
    }
    now_playing {
      id
      timestamp
      song {
        id
        name
        thumbnail_url
        artist {
          id
          name
          thumbnail_url
        }
      }
    }
    reviews {
      id
      stars
      message
    }
  }
  station_groups {
    id
    name
    order
    station_to_station_groups {
      station_id
      order
    }
  }
}
`;

export const getStations = async () => {
  const endpoint = CONSTANTS.GRAPHQL_ENDPOINT;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
        operationName: "GetStations",
        variables: {},
      query
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      return await response.json();
    })
    .catch((error) => {
      Bugsnag.notify(
        new Error("Getting stations error: " + JSON.stringify(error, null, 2)),
      );
      console.error("Error fetching stations:", error);
      return { data: { stations: [] } };
    });
  return {
    stations: response?.data?.stations || [],
  };
};
