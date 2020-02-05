import { useToast } from "@chakra-ui/core";
import { useEffect } from "react";

export const usePwaInstallPrompt = () => {
  const toast = useToast();

  // Detects if device is on iOS
  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };
  // Detects if device is in standalone mode
  const isInStandaloneMode = () =>
    "standalone" in window.navigator && window.navigator["standalone"];

  useEffect(() => {
    if (isIos() && !isInStandaloneMode()) {
      setTimeout(() => {
        toast({
          title: "Install as App",
          description:
            "Install this webapp on your IPhone by selecting Add to homescreen from Share menu",
          status: "success",
          duration: null,
          isClosable: true
        });
      }, 5000);
    }
  }, []);
};
