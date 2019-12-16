import { useEffect } from "react";
const useAuthGuard = ({ user, appLoaded, history }) => {
  useEffect(() => {
    if (appLoaded && !user) {
      history.push("/signin");
    }
  }, [appLoaded]);
};


export default useAuthGuard;
