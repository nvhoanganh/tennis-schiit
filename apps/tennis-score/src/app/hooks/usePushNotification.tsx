import { useToast } from "@chakra-ui/core";
import { askPersmission, isPushEnabled } from "@tennis-score/redux";
import React, { useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { appConfig } from "../../assets/config";
import { Button } from "../components/Button";
export const usePushNotification = ({
  getNotificationSub,
  user,
  pwaHandle,
  groupId
}) => {
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
                      // dispatch action to get and save sub
                      getNotificationSub(groupId).then(_ => {
                        toast({
                          position: "bottom",
                          status: "success",
                          title: "You're all set!",
                          description:
                            "You will be notified when new result is submitted",
                          duration: 3000,
                          isClosable: true
                        });
                      });
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

  const { pwaNotificationSubDeniedKey: permissionDenied } = appConfig;

  useEffect(() => {
    if (
      pwaHandle &&
      user &&
      isPushEnabled() &&
      !user.webPushEnabled &&
      !localStorage.getItem(permissionDenied)
    ) {
      askUser();
    }
  }, []);
};
