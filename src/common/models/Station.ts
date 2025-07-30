// Import types from generated GraphQL
import type { StationType, StationStreamType, PostType, StationUptimeType, StationNowPlayingType, SongType, ArtistType, ReviewType } from "@/lib/graphql";

// Re-export with legacy names for backward compatibility
export type IStation = StationType & {
  // Additional client-side properties
  is_favorite?: boolean;
  // Make some properties match old interface
  uptime?: StationUptimeType | StationUptimeType[];
  now_playing?: StationNowPlayingType | StationNowPlayingType[];
};

export type IStationStreams = StationStreamType;
export type IPost = PostType;
export type IUptime = StationUptimeType;
export type INowPlaying = StationNowPlayingType;
export type ISong = SongType;
export type IArtist = ArtistType;

// Extended type for client usage
export interface IStationExtended extends IStation {
  is_favorite: boolean;
}
