import { useEffect, useState } from "react";
import ReactGA from "react-ga";
const useServiceWorker = registerPwaHandle => {
  const [showInstalling, setShowInstalling] = useState(false);
  const [isInstalled, setIsInstaled] = useState(false);
  const [registration, setRegistration] = useState(null);
  useEffect(() => {
    console.log("SW:registering SW.js", new Date());
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(reg => {
        console.log("SW:service worker registered in app.", new Date());
        ReactGA.set({ dimension2: "true" });
        setRegistration(reg);
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          console.log("SW:update found, status is:", newWorker.state);
          if (newWorker.state === "installing") {
            setShowInstalling(true);
            setTimeout(() => {
              // fall back for the very first version installation
              setShowInstalling(false);
            }, 5000);
          }

          newWorker.addEventListener("statechange", () => {
            console.log("SW:new state", newWorker.state, new Date());
            switch (newWorker.state) {
              case "installed":
                if (navigator.serviceWorker.controller) {
                  console.log("SW:send skip waiting", new Date());
                  newWorker.postMessage({ type: "SKIP_WAITING" });
                }
                break;
            }
          });
        });

        registerPwaHandle(reg);
      });

      let refreshing;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("SW:set showinstalling to false", new Date());
        setShowInstalling(false);
        if (refreshing) return;
        setIsInstaled(true);
        refreshing = true;
      });
    }
  }, []);
  return [showInstalling, isInstalled, registration];
};

export default useServiceWorker;
