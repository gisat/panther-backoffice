/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel-core/polyfill';
import path from 'path';
import express from 'express';
import React from 'react';
import bodyParser from 'body-parser';
import ReactDOM from 'react-dom/server';
import Router from './routes';
import Html from './components/Html';
import apiproxy from './apiproxy';


import {publicPath, serverPort} from './config';

const server = global.server = express();

//server.set('port', (process.env.PORT || 5000));
server.set('port', serverPort);

server.use(express.static(path.join(__dirname, 'public')));

//
// Proxy server for connecting to PUMA API
// -----------------------------------------------------------------------------
server.use(bodyParser());
server.post('/api-proxy/', function(req, res){
	//console.log("°°°°°°°°°°°° PUMA proxy API server.post °°°°°°°°°°°°");
	apiproxy(req, res);
});

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use(publicPath+'/api/content', require('./api/content')); // todo publicPath je tam mozna navic

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
server.get('*', async (req, res, next) => {
	try {
		let statusCode = 200;
		const data = { title: '', description: '', css: '', body: '' };
		const css = [];
		const context = {
			onInsertCss: value => css.push(value),
			onSetTitle: value => data.title = value,
			onSetMeta: (key, value) => data[key] = value,
			onPageNotFound: () => statusCode = 404
		};
		let search = req.url.substr(req.url.indexOf("?"));
		await Router.dispatch({ path: req.path, search: search, context }, (state, component) => {
			data.body = ReactDOM.renderToString(component);
			data.css = css.join('');
		});

		const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
		res.status(statusCode).send('<!doctype html>\n' + html);
	} catch (err) {
		next(err);
	}
});

//
// Launch the server
// -----------------------------------------------------------------------------

server.listen(server.get('port'), () => {
	/* eslint-disable no-console */
	console.log('The server is running at http://localhost:' + server.get('port'));
	if (process.send) {
		process.send('online');
	}
});
