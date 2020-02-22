import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { appConfig } from "../../assets/config";
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
          if (
            newWorker.state === "installing" &&
            localStorage.getItem(appConfig.pwaInstalled)
          ) {
            // only show Installing banner if service worker is already installed.
            setShowInstalling(true);
          }

          newWorker.addEventListener("statechange", () => {
            console.log("SW:new state", newWorker.state, new Date());
            switch (newWorker.state) {
              case "installed":
                if (navigator.serviceWorker.controller) {
                  console.log("SW:send skip waiting", new Date());
                  localStorage.setItem(appConfig.pwaInstalled, "true");
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
