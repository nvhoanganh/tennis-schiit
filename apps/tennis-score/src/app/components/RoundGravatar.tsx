import React from "react";

import Gravatar from "react-gravatar";

function RoundGravatar({ email, size }) {
  return (
    <Gravatar
      email={email}
      size={size}
      style={{
        borderRadius: "50%"
      }}
    />
  );
}

export default RoundGravatar;
