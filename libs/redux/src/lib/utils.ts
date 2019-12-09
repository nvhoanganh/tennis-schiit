export interface IAction {
  type: string;
}
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
