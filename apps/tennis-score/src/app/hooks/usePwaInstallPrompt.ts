import { useToast } from "@chakra-ui/core";
import { useEffect } from "react";
import { isInstalled, isIos } from "@tennis-score/redux";
import { appConfig } from "../../assets/config";

export const usePwaInstallPrompt = () => {
  const toast = useToast();
  const {
    pwaInstallPromptTimesKey: key,
    pwaInstallPromptTimes: max
  } = appConfig;
  // Detects if device is in standalone mode
  useEffect(() => {
    // dont' ask more than 3 times
    if (isIos() && !isInstalled() && +localStorage.getItem(key) < max) {
      setTimeout(() => {
        localStorage.setItem(key, (+localStorage.getItem(key) + 1).toString());
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
