import { AppActionTypes, AppAction } from "../actions";
import { IGroup } from "../models";

export interface IGroupsState {
  [groupId: string]: IGroup;
}

const groups = (state: IGroupsState = {}, action: AppAction): IGroupsState => {
  switch (action.type) {
    case AppActionTypes.ADD_GROUP:
      return {
        ...state,
        [action.group.groupId]: action.group
      };

    case AppActionTypes.DELETE_GROUP:
      const { [action.id]: deleted, ...newState } = state;
      return newState;

    case AppActionTypes.UPDATE_GROUP:
      return {
        ...state,
        [action.group.groupId]: action.group
      };

    case AppActionTypes.LOAD_GROUP_SUCCESS:
      return action.groups;
    case AppActionTypes.ADD_PLAYER_TO_GROUP:
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
    default:
      return state;
  }
};

export default groups;
