import React from "react";

import Gravatar from "react-gravatar";
import { getUserAvatarUrl } from "@tennis-score/redux";

function RoundGravatar({ avatarUrl, email, size }) {
  return !avatarUrl ? (
    <Gravatar
      email={email}
      size={size}
      style={{
        borderRadius: "50%"
      }}
    />
  ) : (
    <img
      src={getUserAvatarUrl(avatarUrl)}
      style={{ borderRadius: "50%", width: size, height: size }}
    />
  );
}

export default RoundGravatar;
