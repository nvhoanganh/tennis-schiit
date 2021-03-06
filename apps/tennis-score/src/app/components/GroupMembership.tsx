import React from "react";
import { isMember, isOwner } from "@tennis-score/redux";
export function GroupMembership({ user, group, showIsMember }) {
  if (!user || !group) return null;
  return (
    <div
      style={{
        display: "inline-block",
        lineHeight: "20px",
        marginLeft: 10,
        verticalAlign: "top"
      }}
    >
      {isOwner(user, group)  ? (
        <span className="badge x-small badge-warning ml-1">Owner</span>
      ) : null}

      {isMember(user, group) && showIsMember ? (
        <span className="badge x-small badge-success ml-1">Member</span>
      ) : null}
    </div>
  );
}
