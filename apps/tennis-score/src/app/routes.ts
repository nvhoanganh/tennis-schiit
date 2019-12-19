import Home from "./containers/Home";
import Leaderboard from "./containers/LeaderboardContainer";
import App from "./containers/App";
import SignIn from "./containers/SignIn";
import SignUp from "./containers/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import UserProfile from "./containers/UserProfile";
import EntryForm from "./containers/EntryForm";
import EditProfile from "./containers/EditProfile";
import NewGroup from './containers/NewGroup';

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
        path: "/newgroup",
        exact: true,
        component: NewGroup
      },
      {
        path: "/leaderboard/:group",
        exact: true,
        component: Leaderboard
      },
      {
        path: "/newscore/:group",
        exact: true,
        component: EntryForm
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
        path: "/account-details/edit",
        exact: true,
        component: EditProfile
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
