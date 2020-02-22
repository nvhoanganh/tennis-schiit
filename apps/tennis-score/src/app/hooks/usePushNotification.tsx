import { useToast } from "@chakra-ui/core";
import { askPersmission, isPushEnabled } from "@tennis-score/redux";
import differenceInDays from "date-fns/differenceInDays";
import React, { useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { appConfig } from "../../assets/config";
import { Button } from "../components/Button";
export const usePushNotification = ({
  getNotificationSub,
  user,
  pwaHandle
}) => {
  const toast = useToast();
  const askUser = () => {
    setTimeout(() => {
      localStorage.setItem(
        numberOfTimesAsked,
        (+localStorage.getItem(numberOfTimesAsked) + 1).toString()
      );
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
                      getNotificationSub().then(_ => {
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

  const {
    pwaNotificationSubKey: numberOfTimesAsked,
    pwaNotificationSubDeniedKey: permissionDenied
  } = appConfig;

  useEffect(() => {
    if (localStorage.getItem(permissionDenied) === "true") {
      // user denied it
      return;
    }

    if (pwaHandle && user && isPushEnabled()) {
      console.log(
        "last refresh",
        differenceInDays(new Date(), user.webPushRefreshedTime.toDate())
      );
      if (
        user.webPush &&
        differenceInDays(new Date(), user.webPushRefreshedTime.toDate()) > 30
      ) {
        console.log(user.webPushRefreshedTime.toDate());
      } else {
        if (+localStorage.getItem(numberOfTimesAsked) > 3) {
          // don't ask too many times
          return;
        }

        askUser();
      }
    }
  }, []);
};
