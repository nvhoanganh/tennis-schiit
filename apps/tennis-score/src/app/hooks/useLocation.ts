import { useEffect, useState } from "react";
import geohash from "ngeohash";

const useLocation = () => {
  const getUserLoc = () => {
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
  const [loc, setLoc] = useState(null);
  useEffect(() => {
    getUserLoc();
  }, []);

  return loc;
};

export default useLocation;
