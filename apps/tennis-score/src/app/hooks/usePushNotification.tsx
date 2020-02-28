import { useToast } from "@chakra-ui/core";
import { appConfig } from "@tennis-score/core";
import { getWebPushSub, isPushEnabled } from "@tennis-score/redux";
import React, { useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { Button } from "../components/Button";
export const usePushNotification = ({ user, pwaHandle, groupId }) => {
  const toast = useToast();
  const askUser = () => {
    setTimeout(() => {
      toast({
        position: "bottom",
        status: "success",
        duration: null,
        isClosable: true,
        render: ({ onClose }) => (
          <div className="m-1 py-3 px-4 bg-dark rounded-lg shadow">
            <p className="text-white d-flex">
              <FaBell className="mr-2 h4 align-self-end" />
              <span className="ml-2 align-self-center">
                Get Notifications for new match result?
              </span>
            </p>
            <p className="text-center py-2">
              <Button
                className="btn btn-sm btn-primary px-3"
                onClick={() => {
                  onClose();
                  getWebPushSub(user.uid, pwaHandle, groupId)
                    .then(() =>
                      toast({
                        position: "bottom",
                        status: "success",
                        title: "You're all set!",
                        description:
                          "You will be notified when new result is submitted",
                        duration: 3000,
                        isClosable: true
                      })
                    )
                    .catch(e => toast(e));
                    
                }}
              >
                Ok
              </Button>
              <Button
                className="btn btn-sm btn-light ml-2"
                onClick={() => {
                  onClose();
                  localStorage.setItem(permissionDenied, "true");
                }}
              >
                No, thanks
              </Button>
            </p>
          </div>
        )
      });
    }, 1000);
  };

  const {
    pwaNotificationSubDeniedKey: permissionDenied,
    pwaNotificationSubKeyOnThisDevice
  } = appConfig;

  useEffect(() => {
    if (
      // device need to support web push
      pwaHandle &&
      user &&
      isPushEnabled() &&
      // and user did not deny it previously
      !localStorage.getItem(permissionDenied) &&
      // or we haven't got the sub key on this device
      !localStorage.getItem(pwaNotificationSubKeyOnThisDevice)
    ) {
      askUser();
    }
  }, []);
};
