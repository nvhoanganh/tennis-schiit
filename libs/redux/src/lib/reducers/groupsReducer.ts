import { IGroup } from "../models";
import { GroupActionTypes, GroupAction } from "../actions";
import { removeById } from "../utils";
import * as firebase from "firebase";

export interface IGroupsState {
  [groupId: string]: IGroup;
}

const groups = (
  state: IGroupsState = {},
  action: GroupAction
): IGroupsState => {
  switch (action.type) {
    case GroupActionTypes.ADD_PLAYER_TO_GROUP:
      const fromState = state[action.groupId];
      return {
        ...state,
        [action.groupId]: {
          ...fromState,
          players: {
            ...fromState.players,
            [action.playerId]: {
              dateJoined: new Date()
            }
          }
        }
      };
    
    case GroupActionTypes.ADD_GROUP:
      return {
        ...state,
        [action.group.groupId]: action.group
      };

    case GroupActionTypes.ADD_TOURNAMENT_SUCCESS:
      return {
        ...state,
        [action.tournament.groupId]: {
          ...state[action.tournament.groupId],
          currentTournament: action.tournament.id
        }
      };

    case GroupActionTypes.JOIN_GROUP_SUCCESS:
      return {
        ...state,
        [action.groupId]: {
          ...state[action.groupId],
          pendingJoinRequests: {
            ...state[action.groupId].pendingJoinRequests,
            [action.user.uid]: {
              ...action.user,
              requestDate: firebase.firestore.Timestamp.fromDate(
                action.user.requestDate
              )
            }
          }
        }
      };

    case GroupActionTypes.CANCEL_JOIN_GROUP_SUCCESS:
      const removed = removeById(
        action.user.uid,
        state[action.groupId].pendingJoinRequests || {}
      );
      return {
        ...state,
        [action.groupId]: {
          ...state[action.groupId],
          pendingJoinRequests: removed
        }
      };

    case GroupActionTypes.REJECT_JOIN_GROUP_SUCCESS:
      const rejected = removeById(
        action.payload.target.uid,
        state[action.payload.groupId].pendingJoinRequests || {}
      );
      return {
        ...state,
        [action.payload.groupId]: {
          ...state[action.payload.groupId],
          pendingJoinRequests: rejected
        }
      };

    case GroupActionTypes.DELETE_GROUP:
      const { [action.id]: deleted, ...newState } = state;
      return newState;

    case GroupActionTypes.UPDATE_GROUP:
      return {
        ...state,
        [action.group.id]: action.group
      };

    case GroupActionTypes.LOAD_GROUPS_SUCCESS:
      return action.groups;

    default:
      return state;
  }
};

export default groups;
