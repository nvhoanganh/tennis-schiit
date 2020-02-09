import { useEffect, useState } from "react";
import { useToast, useDisclosure } from "@chakra-ui/core";
const useServiceWorker = () => {
  const toast = useToast();
  const { onClose } = useDisclosure();
  const [showInstalling, setShowInstalling] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(reg => {
        console.log("service worker registered in app.");
        reg.addEventListener("updatefound", () => {
          let newWorker;
          newWorker = reg.installing;
          newWorker.addEventListener("statechange", () => {
            if (!showInstalling) {
              // show only once
              toast({
                title: "Installing new version...",
                status: "success",
                onClose: onClose,
                duration: 3000,
                isClosable: true
              });
              setShowInstalling(true);
            }

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
        onClose();
        toast({
          title: "New version installed. Reload to see updates",
          status: "success",
          duration: 5000,
          isClosable: true
        });
        // window.location.reload();
        refreshing = true;
      });
    }
  }, []);
};

export default useServiceWorker;
