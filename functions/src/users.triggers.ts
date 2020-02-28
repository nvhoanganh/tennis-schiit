import { db } from "./db";

export function usersOnUpdate(change: any, context: any) {
  //users/{userId}
  const { userId } = context.params;
  const after = change.after.data();
  const before = change.before.data();

  if (before.avatarUrl !== after.avatarUrl && after.groups) {
    console.log("avatar changed, updating groups");
    return Promise.all(
      Object.keys(after.groups).map(groupId => {
        const groupRef = db.collection("groups").doc(groupId);
        return groupRef.get().then(d => {
          console.log("TCL: usersOnUpdate -> d.data()", d.data());
          return d.exists
            ? groupRef.update({
                players: d.data().players.map(x =>
                  x.userId === userId
                    ? {
                        ...x,
                        avatarUrl: after.avatarUrl || ""
                      }
                    : x
                )
              })
            : Promise.resolve();
        });
      })
    );
  }
  return Promise.resolve();
}
