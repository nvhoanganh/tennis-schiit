import App from "./app";
import Home from "./Home";
import Leaderboard from "./Leaderboard";
import EntryForm from './EntryForm';

const routes = [
  {
    component: App,
    routes: [
      {
        path: "/home",
        exact: true,
        component: Home
      },
      {
        path: "/admin",
        exact: true,
        component: Home
      },
      {
        path: "/leaderboard",
        exact: true,
        component: Leaderboard
      },
      {
        path: "/newscore/:group",
        exact: true,
        component: EntryForm
      },
    ]
  }
];

export default routes;
