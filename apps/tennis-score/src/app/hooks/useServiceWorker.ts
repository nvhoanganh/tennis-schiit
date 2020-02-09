import { useEffect } from "react";
import { useToast } from "@chakra-ui/core";
const useServiceWorker = () => {
  const toast = useToast();
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(reg => {
        console.log("service worker registered in app.");
        reg.addEventListener("updatefound", () => {
          toast({
            title: "Installing new version. This app will auto reload..",
            status: "success",
            duration: null,
            isClosable: false
          });
          let newWorker;
          newWorker = reg.installing;
          newWorker.addEventListener("statechange", () => {
            switch (newWorker.state) {
              case "installed":
                console.log("new service worker installled");
                if (navigator.serviceWorker.controller) {
                  newWorker.postMessage({ type: "SKIP_WAITING" });
                }
                break;
            }
          });
        });
      });

      let refreshing;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
      });
    }
  }, []);
};

export default useServiceWorker;
