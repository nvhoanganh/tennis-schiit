import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
export function DropDownMenu({ options, icon }) {
  return (
    <DropdownButton
      drop="left"
      variant="link"
      size="sm"
      title={<FontAwesomeIcon icon={icon} />}
      id="group-menu"
    >
      {options.map(o => o)}
    </DropdownButton>
  );
}
