import Home from "./containers/Home";
import Leaderboard from "./containers/LeaderboardContainer";
import App from "./containers/App";
import SignIn from "./containers/SignIn";
import SignUp from "./containers/SignUp";
import ResetPassword from "./containers/ResetPassword";
import UserProfile from "./containers/UserProfile";
import EntryForm from "./containers/EntryForm";
import EditProfile from "./containers/EditProfile";
import NewGroup from "./containers/NewGroup";
import AddPlayer from "./containers/AddPlayer";
import ManageGroup from "./containers/ManageGroup";
import AddEditTournament from "./containers/AddEditTournament";
import PlayerProfile from "./containers/PlayerProfile";
import ViewResults from "./containers/ViewResults";

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
        path: "/editgroup/:group",
        exact: true,
        component: NewGroup
      },
      {
        path: "/managegroup/:group",
        exact: true,
        component: ManageGroup
      },

      {
        path: "/leaderboard/:group",
        exact: true,
        component: Leaderboard
      },
      {
        path: "/group/:group/player/:id",
        exact: true,
        component: PlayerProfile
      },
      {
        path: "/groups/:group/newplayer",
        exact: true,
        component: AddPlayer
      },
      {
        path: "/groups/:group/newtournament",
        exact: true,
        component: AddEditTournament
      },
      {
        path: "/groups/:group/tournament/:tour",
        exact: true,
        component: AddEditTournament
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
        path: "/groups/:group/tournament/:tour/results",
        exact: true,
        component: ViewResults
      },
      {
        path: "/forgot-password",
        exact: true,
        component: ResetPassword
      }
    ]
  }
];

export default routes;
