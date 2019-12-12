import Home from "./components/Home";
import Leaderboard from "./containers/LeaderboardContainer";
import App from "./containers/App";
import SignIn from "./containers/SignIn";
import SignUp from "./containers/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import UserProfile from "./containers/UserProfile";

const routes = [
  {
    component: App,
    routes: [
      {
        path: "/",
        exact: true,
        component: Home
      },
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
        path: "/leaderboard/:group?",
        exact: true,
        component: Leaderboard
      },
      {
        path: "/signin",
        exact: true,
        component: SignIn
      },
      {
        path: "/signup",
        exact: true,
        component: SignUp
      },
      {
        path: "/account-details",
        exact: true,
        component: UserProfile
      },
      {
        path: "/forgot-password",
        exact: true,
        component: ForgotPassword
      }
    ]
  }
];

export default routes;
