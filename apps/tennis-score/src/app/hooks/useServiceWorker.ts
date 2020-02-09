import { useToast } from "@chakra-ui/core";
import { useEffect, useState } from "react";
const useServiceWorker = () => {
  const toast = useToast();
  const [showInstalling, setShowInstalling] = useState(false);
  useEffect(() => {
    console.log("SW:register SW.js file", new Date());
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(reg => {
        console.log("SW:service worker registered in app.", new Date());
        reg.addEventListener("updatefound", () => {
          let newWorker;
          newWorker = reg.installing;
          console.log("SW:update found, status is:", newWorker.state);
          if (newWorker.state === "installing") {
            setShowInstalling(true);
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
      });

      let refreshing;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("SW:set showinstalling to false", new Date());
        setShowInstalling(false);
        if (refreshing) return;
        toast({
          title: "New version installed. Reload to see updates",
          status: "success",
          duration: 7000,
          isClosable: true
        });
        refreshing = true;
      });
    }
  }, []);
  return showInstalling;
};

export default useServiceWorker;
