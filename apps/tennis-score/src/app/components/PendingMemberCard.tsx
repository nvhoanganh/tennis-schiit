import {
  faSortAmountDown,
  faSortAmountUp,
  faEquals,
  faChevronDown,
  faChevronUp,
  faTicketAlt,
  faCheck,
  faCross,
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React from "react";
import Gravatar from "react-gravatar";
import { LinkContainer } from "react-router-bootstrap";
import { ScoreCard } from "./ScoreCard";
import RoundGravatar from "./RoundGravatar";
import Skeleton from "react-loading-skeleton";
import { Button } from "./Button";
import { formatDistanceToNow } from "date-fns";

const prizeMoneyCls = player =>
  classNames({
    h6: true,
    "text-success": player.prizeMoney > 0,
    "text-danger": player.prizeMoney < 0
  });

const top3 = ranking => ({
  backgroundColor:
    ranking === 0
      ? "gold"
      : ranking === 1
      ? "silver"
      : ranking === 2
      ? "chocolate"
      : ""
});
const arrowClass = "pl-1 h6 align-middle mr-1 h6 ";
const getArrow = player =>
  player.lastWeekscore > player.score ? (
    <FontAwesomeIcon
      icon={faChevronDown}
      className={arrowClass + "text-danger"}
    />
  ) : player.lastWeekscore < player.score ? (
    <FontAwesomeIcon
      icon={faChevronUp}
      className={arrowClass + "text-success"}
    />
  ) : null;
const PendingMemberCard = ({ player, ...props }) => {
  return (
    <div className="col-sm-6 col-md-4 col-lg-3 border-bottom border-top shadow-sm">
      <div className="card-body px-0 py-3">
        <div className="float-left pr-3 pl-0">
          <LinkContainer to={player ? `/player/${player.uid}` : ""}>
            <RoundGravatar size={35} email={player.email || "0"} />
          </LinkContainer>
        </div>
        <div className="mr-auto">
          <LinkContainer to={player ? `/player/${player.uid}` : ""}>
            <a className="h6 text-dark pl-0">{player.displayName}</a>
          </LinkContainer>
          <div className="float-right text-right">
            <Button type="button" className="btn btn-primary btn-sm">
              <FontAwesomeIcon icon={faCheckCircle} />
            </Button>
            <Button type="button" className="btn ml-1 btn-danger btn-sm">
              <FontAwesomeIcon icon={faTimesCircle} />
            </Button>
          </div>
          <div>
            <em className="d-block text-muted x-small">
              {formatDistanceToNow(player.requestDate.toDate(), {
                addSuffix: true
              })}
            </em>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingMemberCard;
