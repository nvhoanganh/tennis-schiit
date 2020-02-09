import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from "@chakra-ui/core";
import React, { useRef } from "react";

const Confirm = ({ title, message, show, ...props }) => {
  const cancelRef = useRef<any>();
  return (
    <>
      <AlertDialog
        isOpen={show}
        size={ props.size || "xs"}
        isCentered={true}
        leastDestructiveRef={cancelRef}
        onClose={props.onCancelAction}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="base" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody fontSize="base">{message}</AlertDialogBody>

          {!props.hideFooter ? (
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={props.onCancelAction}>
                {props.close}
              </Button>
              {props.mainAction ? (
                <Button
                  variantColor={props.mainActionClass}
                  onClick={props.onConfirmAction}
                  ml={3}
                >
                  {props.mainAction}
                </Button>
              ) : null}
            </AlertDialogFooter>
          ) : null}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Confirm;
