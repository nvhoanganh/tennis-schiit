import { IGroup } from "../models";
import { GroupActionTypes, GroupAction } from "../actions";

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

    case GroupActionTypes.DELETE_GROUP:
      const { [action.id]: deleted, ...newState } = state;
      return newState;

    case GroupActionTypes.UPDATE_GROUP:
      return {
        ...state,
        [action.group.groupId]: action.group
      };

    case GroupActionTypes.LOAD_GROUPS_SUCCESS:
      return action.groups;

    default:
      return state;
  }
};

export default groups;
