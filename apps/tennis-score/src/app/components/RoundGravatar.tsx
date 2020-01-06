import gravatar from "gravatar";
import React from "react";
import Img from "react-image";
import Skeleton from "react-loading-skeleton";

function RoundGravatar({ email, uid, size }) {
  const userAvatar = `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/images%2Favatar_${uid}_200x200.png?alt=media`;
  const gravatarUrl = gravatar.url(
    email || "0",
    { s: size, r: "x", d: "retro" },
    false
  );
  return uid ? (
    <Img
      loader={<Skeleton height={size} circle={true} width={size} />}
      src={[userAvatar, gravatarUrl]}
      style={{ borderRadius: "50%", width: size, height: size }}
    />
  ) : (
    <Img
      loader={<Skeleton height={size} circle={true} width={size} />}
      src={gravatarUrl}
      style={{ borderRadius: "50%", width: size, height: size }}
    />
  );
}

export default RoundGravatar;
