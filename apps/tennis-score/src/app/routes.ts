import Home from "./components/Home";
import Leaderboard from "./containers/TopLeaderboard";
import EntryForm from "./components/EntryForm";
import { App } from './containers/App';

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
				path: "/leaderboard/:group?",
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
