/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react';
import Router from 'react-routing/src/Router';
import http from './core/HttpClient';
import App from './components/App';
import ContentPage from './components/ContentPage';
import PageDashboard from './components/PageDashboard';
import PagePlace from './components/PagePlace';
import PageDataLayer from './components/PageDataLayer';
import PageAnalysis from './components/PageAnalysis';
import PageMetadataStructure from './components/PageMetadataStructure';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';


const router = new Router(on => {
  on('*', async (state, next) => {
    const component = await next();
    return component && <App context={state.context}>{component}</App>;
  });

  on('/login', async () => <LoginPage />);

  on('/dashboard', async () => <PageDashboard />);

  on('/place', async () => <PagePlace />);

  on('/datalayer', async () => <PageDataLayer />);

  on('/analysis', async () => <PageAnalysis />);

  on('/metadata', async () => <PageMetadataStructure />);

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
