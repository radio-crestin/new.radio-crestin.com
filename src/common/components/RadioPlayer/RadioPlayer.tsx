"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Hls from "hls.js";
import useSpaceBarPress from "@/common/hooks/useSpaceBarPress";
import { Loading } from "@/icons/Loading";
import { CONSTANTS } from "@/common/constants/constants";
import styles from "./styles.module.scss";
import usePlayer from "@/common/store/usePlayer";
import useStation from "@/common/store/useStation";
import { PLAYBACK_STATE } from "@/common/models/enum";
import { toast } from "react-toastify";
import Heart from "@/icons/Heart";
import useFavourite from "@/common/store/useFavourite";
import { Bugsnag } from "@/common/utils/bugsnag";
import { IStationStreams, IStationExtended } from "@/common/models/Station";

enum STREAM_TYPE {
  HLS = "HLS",
  PROXY = "proxied_stream",
  ORIGINAL = "direct_stream",
}

const MAX_MEDIA_RETRIES = 20;

interface RadioPlayerProps {
  station: IStationExtended | null;
  stations: IStationExtended[];
}

export default function RadioPlayer({ station, stations }: RadioPlayerProps) {
  const { playerVolume, setPlayerVolume } = usePlayer();
  const { currentStation, setCurrentStation, setAllStations } = useStation();
  const [playbackState, setPlaybackState] = useState(PLAYBACK_STATE.STOPPED);
  const router = useRouter();
  const [retries, setRetries] = useState(MAX_MEDIA_RETRIES);
  const [streamType, setStreamType] = useState<STREAM_TYPE | null>(null);
  const { favouriteItems, toggleFavourite } = useFavourite();
  const [isFavorite, setIsFavorite] = useState(false);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
  const [isUsingSilentAudio, setIsUsingSilentAudio] = useState(false);

  // Initialize store with server data
  useEffect(() => {
    setAllStations(stations);
    if (station && !currentStation) {
      setCurrentStation(station);
    }
  }, [station, stations, currentStation, setCurrentStation, setAllStations]);

  // Use currentStation from store, fallback to prop for initial render
  const activeStation = currentStation || station;

  // Memoize critical station values to prevent unnecessary re-renders
  const stationId = useMemo(() => activeStation?.id, [activeStation?.id]);
  const stationSlug = useMemo(() => activeStation?.slug, [activeStation?.slug]);
  const stationTitle = useMemo(() => activeStation?.title, [activeStation?.title]);
  
  // Memoize station streams to prevent unnecessary player reloads
  const stationStreams = useMemo(() => activeStation?.station_streams || [], [activeStation?.station_streams]);

  useEffect(() => {
    if (!activeStation) return;

    const preferredStreamOrder = [
      STREAM_TYPE.HLS,
      STREAM_TYPE.PROXY,
      STREAM_TYPE.ORIGINAL,
    ];

    const availableStreamType = preferredStreamOrder.find((type) =>
      stationStreams.some(
        (stream: IStationStreams) => stream.type === type,
      ),
    );

    setStreamType(availableStreamType || null);
  }, [stationStreams, activeStation]);

  useEffect(() => {
    if (!activeStation) return;
    setIsFavorite(favouriteItems.includes(activeStation.slug));
  }, [favouriteItems, activeStation]);

  useEffect(() => {
    const audio = document.getElementById("audioPlayer") as HTMLAudioElement;
    if (!audio) return;
    audio.volume = playerVolume / 100;
  }, [playerVolume]);

  const getStreamUrl = React.useCallback((type: STREAM_TYPE | null) => {
    if (!type || !stationStreams.length) return null;
    const stream = stationStreams.find(
      (stream: IStationStreams) => stream.type === type,
    );
    return stream?.stream_url || null;
  }, [stationStreams]);

  const retryMechanism = React.useCallback(() => {
    const audio = document.getElementById("audioPlayer") as HTMLAudioElement;
    if (!audio || !activeStation) return;

    setRetries((prevRetries) => {
      if (prevRetries > 0) {
      const availableStreamTypes = stationStreams.map(
        (s: IStationStreams) => s.type,
      );
      const streamOrder = [
        STREAM_TYPE.HLS,
        STREAM_TYPE.PROXY,
        STREAM_TYPE.ORIGINAL,
      ];

      const currentIndex = streamType ? streamOrder.indexOf(streamType) : -1;
      let nextIndex = currentIndex;

      do {
        nextIndex = (nextIndex + 1) % streamOrder.length;
        if (availableStreamTypes.includes(streamOrder[nextIndex])) {
          setStreamType(streamOrder[nextIndex]);
          break;
        }
      } while (nextIndex !== currentIndex);

        if (nextIndex === currentIndex) {
          setStreamType(streamOrder[nextIndex]);
        }
        return prevRetries - 1;
      } else {
        Bugsnag.notify(
          new Error(
            `Hasn't been able to connect to the station - ${stationTitle}. Tried 20 times :P.`,
          ),
        );
        // Defer toast to next tick to avoid updating during render
        setTimeout(() => {
          toast.error(
            <div>
              Nu s-a putut stabili o conexiune cu stația:{" "}
              <strong style={{ fontWeight: "bold" }}>{stationTitle}</strong>
              <br />
              <br />
              <span style={{ marginTop: 20 }}>
                Vă rugăm să încercați mai târziu!
              </span>
            </div>,
            {
              position: "top-center",
              autoClose: 9000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            },
          );
        }, 0);
        return 0;
      }
    });
  }, [stationStreams, streamType, stationTitle, activeStation]);

  const loadHLS = React.useCallback((
    hls_stream_url: string,
    audio: HTMLAudioElement,
    hls: Hls,
  ) => {
    if (Hls.isSupported()) {
      hls.loadSource(hls_stream_url);
      hls.attachMedia(audio);
    } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
      audio.src = hls_stream_url;
    }

    hls.on(Hls.Events.AUDIO_TRACK_LOADING, function () {
      setPlaybackState(PLAYBACK_STATE.BUFFERING);
    });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      setPlaybackState(PLAYBACK_STATE.BUFFERING);
      audio.addEventListener(
        "canplaythrough",
        function () {
          audio.play().catch(() => {
            setPlaybackState(PLAYBACK_STATE.STOPPED);
          });
        },
        { once: true },
      );
    });

    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        Bugsnag.notify(
          new Error(
            `HLS Fatal error - station.title: ${stationTitle}, error: ${JSON.stringify(
              data,
              null,
              2,
            )} - event: ${JSON.stringify(event, null, 2)}`,
          ),
        );
        // Only retry if we're not intentionally stopped with silent audio
        const audio = document.getElementById("audioPlayer") as HTMLAudioElement;
        if (audio && !audio.src.startsWith("data:audio/mp3;base64,")) {
          retryMechanism();
        }
      }
    });
  }, [stationTitle, retryMechanism]);

  // Memoize the current stream URL to detect actual stream changes
  const currentStreamUrl = useMemo(() => {
    return streamType ? getStreamUrl(streamType) : null;
  }, [streamType, getStreamUrl]);

  const resetAndReloadStream = React.useCallback(() => {
    const audio = document.getElementById("audioPlayer") as HTMLAudioElement;
    if (!audio || !streamType || !currentStreamUrl) return;

    // Destroy existing HLS instance outside of the callback to avoid circular dependency
    setHlsInstance((prevHls) => {
      if (prevHls) {
        prevHls.destroy();
      }
      return null;
    });

    if (streamType === STREAM_TYPE.HLS) {
      const newHls = new Hls();
      setHlsInstance(newHls);
      loadHLS(currentStreamUrl, audio, newHls);
    } else {
      audio.src = currentStreamUrl;
      audio.load();
      audio.play().catch((error) => {
        Bugsnag.notify(
          new Error(
            `Error reloading stream - station.title: ${stationTitle}, error: ${JSON.stringify(error, null, 2)}`,
          ),
        );
        retryMechanism();
      });
    }
  }, [streamType, currentStreamUrl, retryMechanism, loadHLS, stationTitle]);

  useEffect(() => {
    const audio = document.getElementById("audioPlayer") as HTMLAudioElement;
    if (!audio) return;

    switch (playbackState) {
      case PLAYBACK_STATE.STARTED:
        // Reset silent audio flag and loop before reloading
        setIsUsingSilentAudio(false);
        audio.loop = false;
        resetAndReloadStream();
        break;
      case PLAYBACK_STATE.STOPPED:
        audio.pause();
        // For HLS streams, load a silent audio to maintain media session state
        if (streamType === STREAM_TYPE.HLS) {
          // Create a data URL for a very short silent audio
          // This is a 0.1 second silent MP3 encoded as base64
          const silentAudioData = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjQ1LjEwMAAAAAAAAAAAAAAA//M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV//////////////////////////////////////////////////8AAAAATGF2YzU4Ljc2AAAAAAAAAAAAAAAAJAQKAAAAAAAAAbDyqK4gAAAAAAAAAAAAAAAAAAAAAP/zOMAAAAAGSAAAAABMQU1FMy45OSAyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==";
          audio.src = silentAudioData;
          audio.loop = true; // Keep looping the silent audio
          setIsUsingSilentAudio(true);
          audio.load();
          // Detach HLS but keep the instance for resuming
          setHlsInstance((prevHls) => {
            if (prevHls) {
              prevHls.stopLoad();
              prevHls.detachMedia();
            }
            return prevHls;
          });
        } else {
          // For non-HLS streams, just pause normally
          setIsUsingSilentAudio(false);
        }
        break;
    }
  }, [playbackState, resetAndReloadStream, streamType]);

  useEffect(() => {
    const audio = document.getElementById("audioPlayer") as HTMLAudioElement;
    if (!audio) return;
    audio.volume = playerVolume / 100;

    return () => {
      setRetries(20);
    };
  }, [stationSlug, playerVolume]);

  useEffect(() => {
    const audio = document.getElementById("audioPlayer") as HTMLAudioElement;
    if (!audio || !streamType || !currentStreamUrl) return;

    // Don't run this effect when we're stopped or using silent audio
    if (playbackState === PLAYBACK_STATE.STOPPED || isUsingSilentAudio) return;

    // Clean up previous HLS instance when stream URL changes
    setHlsInstance((prevHls) => {
      if (prevHls) {
        prevHls.stopLoad();
        prevHls.detachMedia();
        prevHls.destroy();
      }
      return null;
    });

    let hls: Hls | null = null;

    switch (streamType) {
      case STREAM_TYPE.HLS:
        hls = new Hls();
        setHlsInstance(hls);
        loadHLS(currentStreamUrl, audio, hls);
        break;
      case STREAM_TYPE.PROXY:
        audio.src = currentStreamUrl;
        audio.play().catch((error) => {
          Bugsnag.notify(
            new Error(
              `Switching from HLS -> PROXY error:157 - station.title: ${stationTitle}, error: ${JSON.stringify(error, null, 2)}`,
            ),
          );
          retryMechanism();
        });
        break;
      case STREAM_TYPE.ORIGINAL:
        audio.src = currentStreamUrl;
        audio.play().catch((error) => {
          Bugsnag.notify(
            new Error(
              `Switching from PROXY to ORIGINAL error:168 - station.title: ${stationTitle}, error: ${JSON.stringify(error, null, 2)}`,
            ),
          );
          retryMechanism();
        });
    }

    return () => {
      // Clean up HLS instance on unmount or dependencies change
      if (hls) {
        hls.stopLoad();
        hls.detachMedia();
        hls.destroy();
      }
      // Also clean up the state HLS instance
      setHlsInstance((prevHls) => {
        if (prevHls && prevHls !== hls) {
          prevHls.stopLoad();
          prevHls.detachMedia();
          prevHls.destroy();
        }
        return null;
      });
    };
  }, [streamType, currentStreamUrl, loadHLS, retryMechanism, stationTitle, playbackState, isUsingSilentAudio]);

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      setHlsInstance((prevHls) => {
        if (prevHls) {
          prevHls.stopLoad();
          prevHls.detachMedia();
          prevHls.destroy();
        }
        return null;
      });
    };
  }, []);

  const nextRandomStation = React.useCallback(() => {
    const upStations = stations.filter(
      (station: any) => station.uptime.is_up === true,
    );

    const currentIndex = upStations.findIndex((s: any) => s.id === stationId);

    const nextIndex = currentIndex + 1;
    const nextStation = upStations[nextIndex % upStations.length];

    router.push(`/${nextStation.slug}`);
  }, [stations, stationId, router]);

  useEffect(() => {
    if ("mediaSession" in navigator && activeStation) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: activeStation.now_playing?.song?.name || activeStation.title,
        artist: activeStation.now_playing?.song?.artist?.name || "",
        artwork: [
          {
            src: activeStation.thumbnail_url || CONSTANTS.DEFAULT_COVER,
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        setPlaybackState(PLAYBACK_STATE.STARTED);
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        setPlaybackState(PLAYBACK_STATE.STOPPED);
      });

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        nextRandomStation();
      });

      navigator.mediaSession.setActionHandler("previoustrack", () => {
        history.back();
      });
    }
  }, [activeStation, nextRandomStation]);

  useSpaceBarPress(() => {
    if (
      playbackState === PLAYBACK_STATE.PLAYING ||
      playbackState === PLAYBACK_STATE.STARTED
    ) {
      setPlaybackState(PLAYBACK_STATE.STOPPED);
      return;
    }

    if (playbackState === PLAYBACK_STATE.STOPPED) {
      setPlaybackState(PLAYBACK_STATE.STARTED);
    }
  });

  const renderPlayButtonSvg = () => {
    switch (playbackState) {
      case PLAYBACK_STATE.STARTED:
        return <Loading />;
      case PLAYBACK_STATE.BUFFERING:
        return <Loading />;
      case PLAYBACK_STATE.PLAYING:
        return (
          <path
            fill="white"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
          />
        );
      default:
        return (
          <path
            fill="white"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z"
          />
        );
    }
  };

  if (!activeStation) {
    return null;
  }

  return (
    <div className={styles.radio_player_container}>
      <div className={styles.radio_player}>
        <div className={styles.player_container}>
          <div className={styles.image_container}>
            <img
              src={
                activeStation.now_playing?.song?.thumbnail_url ||
                activeStation.thumbnail_url ||
                CONSTANTS.DEFAULT_COVER
              }
              alt={`${activeStation.title} | Radio Crestin`}
              className={styles.station_thumbnail}
            />
            <div
              className={styles.heart_container}
              onClick={() => toggleFavourite(activeStation?.slug || "")}
            >
              <Heart
                color={isFavorite ? "red" : "white"}
                defaultColor={"red"}
              />
            </div>
          </div>

          <div className={`${styles.station_info} ${styles.two_lines}`}>
            <h2 className={styles.station_title}>{activeStation.title}</h2>
            <p className={styles.song_name}>
              {activeStation?.now_playing?.song?.name}
              {activeStation?.now_playing?.song?.artist?.name && (
                <span className={styles.artist_name}>
                  {" · "}
                  {activeStation?.now_playing?.song?.artist?.name}
                </span>
              )}
            </p>
          </div>

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

          <div className={styles.play_button_container}>
            <button
              aria-label="Play"
              className={styles.play_button}
              onClick={() => {
                if (
                  playbackState === PLAYBACK_STATE.PLAYING ||
                  playbackState === PLAYBACK_STATE.STARTED
                ) {
                  setPlaybackState(PLAYBACK_STATE.STOPPED);
                  return;
                }

                if (playbackState === PLAYBACK_STATE.STOPPED) {
                  setPlaybackState(PLAYBACK_STATE.STARTED);
                }
              }}
            >
              <svg
                width="50px"
                height="50px"
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                {renderPlayButtonSvg()}
              </svg>
            </button>
          </div>
        </div>

        <audio
          preload="true"
          autoPlay
          id="audioPlayer"
          onPlaying={() => {
            setPlaybackState(PLAYBACK_STATE.PLAYING);
          }}
          onPlay={() => {
            setPlaybackState(PLAYBACK_STATE.PLAYING);
          }}
          onPause={() => {
            setPlaybackState(PLAYBACK_STATE.STOPPED);
          }}
          onWaiting={() => {
            setPlaybackState(PLAYBACK_STATE.BUFFERING);
          }}
          onEnded={() => {
            // Prevent any action when silent audio ends (it's looping anyway)
            if (!isUsingSilentAudio) {
              // If needed, handle regular audio ending here
            }
          }}
          onError={(error) => {
            // Don't retry when using silent audio
            if (!isUsingSilentAudio) {
              Bugsnag.notify(
                new Error(
                  `Audio error:414 - station.title: ${stationTitle}, error: ${error}`,
                ),
              );
              retryMechanism();
            }
          }}
        />
      </div>
    </div>
  );
}
