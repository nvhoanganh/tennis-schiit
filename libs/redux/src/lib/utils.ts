export function delay(duration): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
export const arrayToObject = (array: any[], keymap, valuemap) => {
  return array.reduce((presV, currV) => {
    return {
      ...presV,
      [keymap(currV)]: valuemap(currV)
    };
  }, {});
};

export const isOwner = (user, group) =>
  user && group && group.owner === user.uid;
export const isMember = (user, group) =>
  user && group && !!group.players[user.uid];

export const removeById = (id, obj) => {
  const { [id]: removed, ...newState } = obj;
  return newState;
};

export const roundOff = roundOff => Math.floor(roundOff * 100) / 100;