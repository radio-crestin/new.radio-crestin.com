import { gql } from "@/lib/graphql";

export const GET_STATIONS_QUERY = gql(`
  query GetStations {
    stations(order_by: { order: asc }) {
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
      posts(limit: 1, order_by: { published: desc }) {
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
`);

// Create a lightweight query for listing pages that don't need all data
export const GET_STATIONS_LIST_QUERY = gql(`
  query GetStationsList {
    stations(order_by: { order: asc }) {
      id
      order
      title
      slug
      thumbnail_url
      total_listeners
      radio_crestin_listeners
      description
      uptime {
        is_up
      }
      now_playing {
        id
        song {
          name
          artist {
            name
          }
        }
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
`);

// Create a query for single station page with all necessary data
export const GET_STATION_DETAIL_QUERY = gql(`
  query GetStationDetail {
    stations(order_by: { order: asc }) {
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
      posts(limit: 1, order_by: { published: desc }) {
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
  }
`);