/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react';
import Router from 'react-routing/src/Router';
import http from './core/HttpClient';
import App from './components/App';
import ContentPage from './components/ContentPage';
import PageDashboard from './components/PageDashboard';
import PagePlaces from './components/PagePlaces';
import PageDataLayers from './components/PageDataLayers';
import PageAnalyses from './components/PageAnalyses';
import PageMetadata from './components/PageMetadata';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';

import { publicPath } from './config';

const router = new Router(on => {
	on('*', async (state, next) => {
		const component = await next();
		return component && <App context={state.context}>{React.cloneElement(component, {screenState: parseScreens(state.params.activePath, state.search)} )}</App>;
	});

	hookRoute(on, '/login', async () => <LoginPage />);

	hookRoute(on, '/', async () => <PageDashboard />);

	hookRoute(on, '/places', async () => <PagePlaces />);

	hookRoute(on, '/datalayers', async () => <PageDataLayers />);

	hookRoute(on, '/analyses', async () => <PageAnalyses />);

	hookRoute(on, '/metadata', async () => <PageMetadata />);

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
