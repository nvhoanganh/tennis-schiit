import { useToast } from "@chakra-ui/core";
import {
  isInstalled,
  isPushEnabled,
  isIos,
  askPersmission
} from "@tennis-score/redux";
import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { appConfig } from "../../assets/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
export const usePushNotification = () => {
  const toast = useToast();
  const {
    pwaNotificationSubKey: key,
    pwaNotificationSubGivenKey: subscribedKey,
    pwaNotificationSubTimes: max
  } = appConfig;
  useEffect(() => {
    if (
      isPushEnabled() &&
      !isInstalled() &&
      !localStorage.getItem(subscribedKey)
    ) {
      setTimeout(() => {
        localStorage.setItem(key, (+localStorage.getItem(key) + 1).toString());
        toast({
          position: "bottom",
          status: "success",
          duration: null,
          isClosable: true,
          render: ({ onClose }) => (
            <div className="m-1 py-3 px-4 bg-dark rounded-lg shadow">
              <p className="text-white d-flex">
                <FontAwesomeIcon
                  icon={faBell}
                  className="mr-2 h4 align-self-end"
                />
                <span className="ml-2 align-self-center">
                  Get Notifications for new match result?
                </span>
              </p>
              <p className="text-center py-2">
                <Button
                  className="btn btn-sm btn-primary px-3"
                  onClick={() => {
                    onClose();
                    askPersmission().then(result => {
                      if (result !== "granted") {
                        toast({
                          position: "bottom",
                          status: "error",
                          title: "Oops! Something went wrong",
                          description:
                            "Please enable this option via site Settings",
                          duration: null,
                          isClosable: true
                        });
                      } else {
                        localStorage.setItem(subscribedKey, "true");
                      }
                    });
                  }}
                >
                  Ok
                </Button>
                <Button
                  className="btn btn-sm btn-light ml-2"
                  onClick={() => {
                    onClose();
                    localStorage.setItem(subscribedKey, "true");
                  }}
                >
                  No, thanks
                </Button>
              </p>
            </div>
          )
        });
      }, 1000);
    }
  }, []);
};
