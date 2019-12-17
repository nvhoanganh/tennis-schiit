import React from "react";
export function GroupMembership({ user, group }) {
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
      {group.owner === user.uid ? (
        <span className="badge badge-warning ml-1">Owner</span>
      ) : null}

      {group.players[user.uid] ? (
        <span className="badge badge-success ml-1">Member</span>
      ) : null}
    </div>
  );
}
