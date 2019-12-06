import App from "./components/app";
import Home from "./components/Home";
import Leaderboard from "./containers/TopLeaderboard";
import EntryForm from "./components/EntryForm";

const routes = [
	{
		component: App,
		routes: [
			{
				path: "/",
				exact: true,
				component: Leaderboard
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
				path: "/leaderboard",
				exact: true,
				component: Leaderboard
			},
			{
				path: "/newscore/:group",
				exact: true,
				component: EntryForm
			}
		]
	}
];

export default routes;
