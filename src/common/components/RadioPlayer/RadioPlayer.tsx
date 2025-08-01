"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Hls from "hls.js";
import { Loading } from "@/icons/Loading";
import { CONSTANTS } from "@/common/constants/constants";
import styles from "./styles.module.scss";
import usePlayer from "@/common/store/usePlayer";
import { PLAYBACK_STATE } from "@/common/models/enum";
import Heart from "@/icons/Heart";
import useFavourite from "@/common/store/useFavourite";
import { IStationStreams, IStationExtended } from "@/common/models/Station";
import { useSelectedStation } from "@/common/providers/SelectedStationProvider";

interface RadioPlayerProps {
  initialStation: IStationExtended | null;
}

export default function RadioPlayer({ initialStation }: RadioPlayerProps) {
  const { playerVolume, setPlayerVolume } = usePlayer();
  const [playbackState, setPlaybackState] = useState(PLAYBACK_STATE.STOPPED);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const { favouriteItems, toggleFavourite } = useFavourite();
  const [isFavorite, setIsFavorite] = useState(false);
  const hlsRef = useRef<Hls | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Use context station or fall back to initial
  const { selectedStation: contextStation } = useSelectedStation();
  const activeStation = contextStation || initialStation;

  // Get sorted streams by order
  const sortedStreams = useMemo(() => {
    if (!activeStation?.station_streams) return [];
    return [...activeStation.station_streams].sort((a, b) => 
      (a.order || 999) - (b.order || 999)
    );
  }, [activeStation?.station_streams]);

  // Current stream URL with session tracking
  const currentStreamUrl = useMemo(() => {
    if (!sortedStreams[currentStreamIndex]) return null;
    
    const stream = sortedStreams[currentStreamIndex];
    if (!stream.stream_url) return null;
    
    // Add session tracking (only on client side)
    const url = new URL(stream.stream_url);
    
    if (typeof window !== 'undefined') {
      const uuid = localStorage.getItem('radio-crestin-session-uuid') || crypto.randomUUID();
      localStorage.setItem('radio-crestin-session-uuid', uuid);
      url.searchParams.set('ref', window.location.hostname);
      url.searchParams.set('s', uuid);
    }
    
    return url.toString();
  }, [sortedStreams, currentStreamIndex]);

  // Check if current stream is HLS
  const isHLS = useMemo(() => {
    return sortedStreams[currentStreamIndex]?.type === 'HLS';
  }, [sortedStreams, currentStreamIndex]);

  // Update favorite status
  useEffect(() => {
    if (!activeStation) return;
    setIsFavorite(favouriteItems.includes(activeStation.slug));
  }, [favouriteItems, activeStation]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerVolume / 100;
    }
  }, [playerVolume]);

  // Reset stream index when station changes
  useEffect(() => {
    setCurrentStreamIndex(0);
  }, [activeStation?.id]);

  // Try next stream in the list
  const tryNextStream = React.useCallback(() => {
    if (currentStreamIndex < sortedStreams.length - 1) {
      setCurrentStreamIndex(prev => prev + 1);
    } else {
      // All streams failed
      setPlaybackState(PLAYBACK_STATE.STOPPED);
    }
  }, [currentStreamIndex, sortedStreams.length]);

  // Handle stream loading and playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentStreamUrl) return;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Only load if we're playing or trying to start
    if (playbackState === PLAYBACK_STATE.STOPPED) {
      audio.pause();
      return;
    }

    if (isHLS && Hls.isSupported()) {
      // Use HLS.js for HLS streams
      const hls = new Hls();
      hlsRef.current = hls;
      
      hls.loadSource(currentStreamUrl);
      hls.attachMedia(audio);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audio.play().catch(() => {
          setPlaybackState(PLAYBACK_STATE.STOPPED);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          // Try next stream
          tryNextStream();
        }
      });
    } else {
      // Direct stream playback
      audio.src = currentStreamUrl;
      audio.play().catch(() => {
        // Try next stream on error
        tryNextStream();
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentStreamUrl, isHLS, playbackState, sortedStreams.length, currentStreamIndex, tryNextStream]);

  // Update media session
  useEffect(() => {
    if ("mediaSession" in navigator && activeStation) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: activeStation.now_playing?.song?.name || activeStation.title,
        artist: activeStation.now_playing?.song?.artist?.name || "",
        artwork: [{
          src: activeStation.thumbnail_url || CONSTANTS.DEFAULT_COVER,
          sizes: "512x512",
          type: "image/png",
        }],
      });
    }
  }, [activeStation]);

  const togglePlayback = () => {
    if (playbackState === PLAYBACK_STATE.PLAYING) {
      setPlaybackState(PLAYBACK_STATE.STOPPED);
    } else {
      setPlaybackState(PLAYBACK_STATE.STARTED);
    }
  };

  const renderPlayButton = () => {
    if (playbackState === PLAYBACK_STATE.BUFFERING || 
        playbackState === PLAYBACK_STATE.STARTED) {
      return <Loading />;
    }
    
    if (playbackState === PLAYBACK_STATE.PLAYING) {
      return (
        <path
          fill="white"
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
        />
      );
    }
    
    return (
      <path
        fill="white"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z"
      />
    );
  };

  if (!activeStation) return null;

  return (
    <div className={styles.radio_player_container}>
      <div className={styles.radio_player}>
        <div className={styles.player_container}>
          {/* Album art with favorite button */}
          <div className={styles.image_container}>
            <img
              src={activeStation.now_playing?.song?.thumbnail_url || 
                   activeStation.thumbnail_url || 
                   CONSTANTS.DEFAULT_COVER}
              alt={`${activeStation.title} | Radio Crestin`}
              className={styles.station_thumbnail}
            />
            <div
              className={styles.heart_container}
              onClick={() => toggleFavourite(activeStation.slug)}
            >
              <Heart color={isFavorite ? "red" : "white"} defaultColor="red" />
            </div>
          </div>

          {/* Station info and metadata */}
          <div className={`${styles.station_info} ${styles.two_lines}`}>
            <h2 className={styles.station_title}>{activeStation.title}</h2>
            <p className={styles.song_name}>
              {activeStation.now_playing?.song?.name}
              {activeStation.now_playing?.song?.artist?.name && (
                <span className={styles.artist_name}>
                  {" · "}
                  {activeStation.now_playing?.song?.artist?.name}
                </span>
              )}
            </p>
          </div>

          {/* Volume control */}
          <div className={styles.volume_slider}>
            <input
              type="range"
              min="0"
              max="100"
              value={playerVolume}
              className={styles.slider}
              onChange={(e) => setPlayerVolume(Number(e.target.value))}
              aria-label="Player Volume"
            />
          </div>

          {/* Play/pause button */}
          <div className={styles.play_button_container}>
            <button
              aria-label="Play"
              className={styles.play_button}
              onClick={togglePlayback}
            >
              <svg width="50px" height="50px" viewBox="0 0 24 24">
                {renderPlayButton()}
              </svg>
            </button>
          </div>
        </div>

        {/* Audio element */}
        <audio
          ref={audioRef}
          onPlaying={() => setPlaybackState(PLAYBACK_STATE.PLAYING)}
          onPlay={() => setPlaybackState(PLAYBACK_STATE.PLAYING)}
          onPause={() => setPlaybackState(PLAYBACK_STATE.STOPPED)}
          onWaiting={() => setPlaybackState(PLAYBACK_STATE.BUFFERING)}
          onError={() => tryNextStream()}
        />
      </div>
    </div>
  );
}