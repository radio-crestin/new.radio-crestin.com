import { useContext, useEffect } from "react";
import { getStations } from "@/common/services/getStations";
import { IStation } from "@/common/models/Station";
import { Context } from "@/common/context/ContextProvider";
import { usePathname } from "next/navigation";
import { Bugsnag } from "@/common/utils/bugsnag";

const useUpdateStationsMetadata = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useUpdateStationsMetadata must be used within ContextProvider");
  }
  const { ctx, setCtx } = context;
  const pathname = usePathname();

  useEffect(() => {
    // Extract station slug from pathname
    const station_slug = pathname?.split('/')[1];
    if (station_slug && ctx?.stations) {
      const selectedStationIndex = ctx.stations.findIndex(
        (s: IStation) => s.slug === station_slug,
      );

      setCtx({
        selectedStation: ctx.stations[selectedStationIndex],
      });
    }
  }, [pathname, ctx.stations, setCtx]);

  // useEffect(() => {
  //   const fetchStationsData = async () => {
  //     try {
  //       const data = await getStations();
  //       if (data?.stations && data?.stations.length > 0) {
  //         setCtx({
  //           stations: data.stations,
  //         });
  //       }
  //     } catch (error) {
  //       Bugsnag.notify(
  //         new Error(
  //           `Failed to fetch stations - error: ${JSON.stringify(
  //             error,
  //             null,
  //             2,
  //           )}`,
  //         ),
  //       );
  //     }
  //   };
  //
  //   fetchStationsData();
  //   const intervalId = setInterval(fetchStationsData, 10000);
  //
  //   return () => clearInterval(intervalId);
  // }, []);
};

export default useUpdateStationsMetadata;
