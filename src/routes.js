/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react';
import Router from 'react-routing/src/Router';
import http from './core/HttpClient';
import App from './components/App';
import Page from './components/Page';
import LoginPage from './components/pages/LoginPage';
import ContentPage from './components/temp/ContentPage';
import NotFoundPage from './components/temp/NotFoundPage';
import ErrorPage from './components/temp/ErrorPage';
import UserStore from './stores/UserStore';

import { publicPath } from './config';

import RegisterPage from './components/pages/RegisterPage';
import UpdatePage from './components/pages/UpdatePage';

const router = new Router(on => {
	on('*', async (state, next) => {
		console.log(state);
		let currentUser = await UserStore.getCurrentUser();
		let component;
		if(currentUser) {
			component = await next();
		} else {
			if(state.params.activePath.indexOf('register') != -1) {
				component = <RegisterPage/>
			} else {
				component = <LoginPage/>;
			}
		}
		return component &&
			<App
				context={state.context}
				currentUser={currentUser}
			>
				{React.cloneElement(component, {screenState: parseScreens(state.params.activePath, state.search)} )}
			</App>;
	});

	hookRoute(on, '/login', async () => <LoginPage />);

	hookRoute(on, '/update', async () => <UpdatePage />);

	hookRoute(on, '/', async () => <Page screenSet="dashboard" />);

	hookRoute(on, '/places', async () => <Page screenSet="places" />);

	hookRoute(on, '/datalayers', async () => <Page screenSet="dataLayers" />);

	hookRoute(on, '/analyses', async () => <Page screenSet="analyses" />);

	hookRoute(on, '/metadata', async () => <Page screenSet="metadata" />);

	hookRoute(on, '/permissions', async () => <Page screenSet="permissions" />);

	hookRoute(on, '/layers', async () => <Page screenSet="layers" />);

	on('*', async (state) => {
		const content = await http.get(`${publicPath}/api/content?path=${state.path}`);
		return content && <ContentPage {...content} />;
	});

	on('error', (state, error) => state.statusCode === 404 ?
		<App context={state.context} error={error}><NotFoundPage /></App> :
		<App context={state.context} error={error}><ErrorPage /></App>
	);
});

function hookRoute(on, path, func) {
	on(publicPath + path, func);
	on(path, func);
	on(publicPath + path + "/:activePath(.*)", func);
	on(path + "/:activePath(.*)", func);
}

function parseScreens(activePath, search){
	if(search.substr(0, 1) == "?") search = search.substr(1);
	// todo: finish
	return search;
}

export default router;
