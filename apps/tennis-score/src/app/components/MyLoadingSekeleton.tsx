import React from "react";

function MyLoadingSkeleton({ height, ...props }) {
  return (
    <span
      className="css-19bon8n react-loading-skeleton"
      style={{
        height,
        width: props.width || "100%",
        ...(props.circle && { borderRadius: "50%" }),
        animation:
          "1.2s ease-in-out 0s infinite normal none running animation-16jpnkj",
        ...props.style
      }}
    ></span>
  );
}

export default MyLoadingSkeleton;
