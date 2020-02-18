import { useEffect, useState } from "react";
import geohash from "ngeohash";
export const getUserLoc = setLoc => {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      setLoc(geohash.encode(latitude, longitude));
    },
    err => {
      console.warn(
        `Cant get user location, ERROR(${err.code}): ${err.message}`
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
};
const useLocation = () => {
  const [loc, setLoc] = useState(null);
  useEffect(() => {
    getUserLoc(setLoc);
  }, []);

  return loc;
};

export default useLocation;
