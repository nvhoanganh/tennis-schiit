import React from "react";
import { Button } from "./Button";
export function ScoreCard({
  played,
  won,
  lost,
  bagelWin,
  bagelLost,
  fontSize
}) {
  const props = {
    style: { fontSize: fontSize || "0.8rem" },
    type: "button",
    className: "btn btn-sm btn-default"
  };
  return (
    <div>
      <Button {...props}>
        P<span className="ml-1 badge badge-light">{played}</span>
      </Button>
      <Button {...props}>
        W<span className="ml-1 badge badge-success">{won}</span>
      </Button>
      <Button {...props}>
        L<span className="ml-1 badge badge-danger">{lost}</span>
      </Button>
      <Button {...props}>
        BW<span className="ml-1 badge badge-warning">{bagelWin}</span>
      </Button>
      <Button {...props}>
        BL<span className="ml-1 badge badge-danger">{bagelLost}</span>
      </Button>
    </div>
  );
}
