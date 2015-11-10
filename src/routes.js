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
import PageMetadataStructures from './components/PageMetadataStructures';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';

import { publicPath } from './config';

const router = new Router(on => {
  on('*', async (state, next) => {
    const component = await next();
    return component && <App context={state.context}>{component}</App>;
  });

  on('/login', async () => <LoginPage />);

  on('/', async () => <PageDashboard />);

  on('/places', async () => <PagePlaces />);

  on('/datalayers', async () => <PageDataLayers />);

  on('/analyses', async () => <PageAnalyses />);

  on('/metadata', async () => <PageMetadataStructures />);

  on('*', async (state) => {
    const content = await http.get(`${publicPath}/api/content?path=${state.path}`);
    return content && <ContentPage {...content} />;
  });

  on('error', (state, error) => state.statusCode === 404 ?
    <App context={state.context} error={error}><NotFoundPage /></App> :
    <App context={state.context} error={error}><ErrorPage /></App>
  );
});

export default router;
