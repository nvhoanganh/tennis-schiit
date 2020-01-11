import gravatar from "gravatar";
import React from "react";
import Img from "react-image";
import Skeleton from "react-loading-skeleton";
import MyLoadingSkeleton from "./MyLoadingSekeleton";

function RoundGravatar({ email, uid, size, ...props }) {
  const userAvatar = `https://firebasestorage.googleapis.com/v0/b/tennis-schiit.appspot.com/o/images%2Favatar_${uid}_200x200.png?alt=media`;
  const gravatarUrl = gravatar.url(
    email || "0",
    { s: size, r: "x", d: "retro" },
    false
  );
  return uid ? (
    <Img
      loader={
        <MyLoadingSkeleton
          height={size}
          circle={true}
          width={size}
          style={props.style}
        />
      }
      src={[userAvatar, gravatarUrl]}
      style={{ borderRadius: "50%", width: size, height: size, ...props.style }}
    />
  ) : (
    <Img
      loader={
        <MyLoadingSkeleton
          height={size}
          circle={true}
          width={size}
          style={props.style}
        />
      }
      src={gravatarUrl}
      style={{ borderRadius: "50%", width: size, height: size, ...props.style }}
    />
  );
}

export default RoundGravatar;
