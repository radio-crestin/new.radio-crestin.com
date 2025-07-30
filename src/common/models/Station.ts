// Import types from generated GraphQL
import type { StationType, StationStreamType, StationNowPlayingType, StationUptimeType } from "@/lib/graphql/graphql";

// Re-export with legacy names for backward compatibility
export type IStation = Omit<StationType, 'now_playing' | 'uptime'> & {
  // Additional client-side properties
  is_favorite?: boolean;
  // Convert singular to array for backward compatibility
  now_playing?: (StationNowPlayingType | null)[] | null;
  uptime?: (StationUptimeType | null)[] | null;
};

export type IStationStreams = StationStreamType;

// Extended type for client usage
export interface IStationExtended extends IStation {
  is_favorite: boolean;
}
