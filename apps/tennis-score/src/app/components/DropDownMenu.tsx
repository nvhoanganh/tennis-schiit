import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  useDisclosure
} from "@chakra-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Children } from "react";

export function DropDownMenu({ options, icon }) {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  return (
    <>
      <button onClick={onOpen} type="button" className="btn btn-link btn-sm">
        <FontAwesomeIcon icon={icon} />
      </button>
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody className="py-4 pb-5">
            {options.map(o => (
              <span
                key={o.key}
                onClick={() => {
                  onToggle();
                }}
              >
                {o}
              </span>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export function DrawerLink(props) {
  return (
    <>
      <a className="h5 py-2 d-block">{props.children}</a>
    </>
  );
}
