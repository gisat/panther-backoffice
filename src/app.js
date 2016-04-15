/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel-core/polyfill';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import Router from './routes';
import Location from './core/Location';
import { addEventListener, removeEventListener } from './utils/DOMUtils';
import ga from 'react-ga';
import update from 'react-addons-update';

import { googleAnalyticsId, loggingLevel } from './config';

import utils from './utils/utils';
import logger from './core/Logger';

let cssContainer = document.getElementById('css');
const appContainer = document.getElementById('app');

var activePageKey = null;
const context = {
	setStateDeep: function(updatePath){
		logger.trace("context# setStateDeep(), Current this: ", this, ", updatePath: ", updatePath);
		if(this.mounted) {
			this.setState(update(this.state, updatePath));
		} else {
			logger.warn("context# setStateDeep(), Tries to update deep state of unmounted component.", updatePath);
		}
	},
	onSetTitle: value => document.title = value,
	activePageKey: function(newKey){
		if(typeof newKey != "undefined") activePageKey = newKey;
		return activePageKey;
	},
	onSetMeta: (name, content) => {
		// Remove and create a new <meta /> tag in order to make it work
		// with bookmarks in Safari
		const elements = document.getElementsByTagName('meta');
		[].slice.call(elements).forEach((element) => {
			if (element.getAttribute('name') === name) {
				element.parentNode.removeChild(element);
			}
		});
		const meta = document.createElement('meta');
		meta.setAttribute('name', name);
		meta.setAttribute('content', content);
		document.getElementsByTagName('head')[0].appendChild(meta);
	},

	/**
	 * @param store2state
	 * @param keys It should limit the stores, which are being loaded.
	 * @returns {Promise.<TResult>}
	 */
	setStateFromStores: function(store2state,keys){
		logger.trace("context# setStateFromStores(), Current this: ", this, "\n keys:", keys, "\n store2state: ", store2state);
		var setAll = false;
		if(!keys){
			keys = [];
			setAll = true;
		}
		var component = this;
		var storeLoads = [];
		var storeNames = [];
		for(var name in store2state){
			if(setAll || (keys.indexOf(name)!=-1)) {
				storeLoads.push(store2state[name]);
				// todo to clone or not to clone, that is the question
				//storeLoads.push(utils.deepClone(store2state[name]));
				storeNames.push(name);
			}
		}
		return Promise.all(storeLoads).then(function(data){
			var storeObject = {};
			for(var i in storeNames){
				storeObject[storeNames[i]] = data[i];
			}
			if(component.mounted) {
				logger.trace("context# setStateFromStores(), Stores to set: ", storeObject, ", Current Component: ", component);
				component.setState(storeObject);
			} else {
				logger.info("context# setStateFromStores(), Component is already unmounted." + component);
				component.render();
			}
		});
	}
};


function render(state) {
	Router.dispatch(state, (newState, component) => {
		logger.info("Router# dispatch, New state: ", newState);
		ReactDOM.render(component, appContainer, () => {
			// Restore the scroll position if it was saved into the state
			if (state.scrollY !== undefined) {
				window.scrollTo(state.scrollX, state.scrollY);
			} else {
				window.scrollTo(0, 0);
			}

			// Remove the pre-rendered CSS because it's no longer used
			// after the React app is launched
			if (cssContainer) {
				cssContainer.parentNode.removeChild(cssContainer);
				cssContainer = null;
			}
		});
	});
}

function run() {
	let currentLocation = null;
	let currentState = null;

	var gaOptions = { debug: true };
	ga.initialize(googleAnalyticsId, gaOptions);

	logger.setLevel(loggingLevel);

	// Make taps on links and buttons work fast on mobiles
	FastClick.attach(document.body);

	// Re-render the app when window.location changes
	const unlisten = Location.listen(location => {
		currentLocation = location;
		currentState = Object.assign({}, location.state, {
			path: location.pathname,
			query: location.query,
			state: location.state,
			search: location.search,
			context
		});
		logger.info("app# Location change, Current state: ", currentState);
		render(currentState);
	});

	// Save the page scroll position into the current location's state
	const supportPageOffset = window.pageXOffset !== undefined;
	const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
	const setPageOffset = () => {
		currentLocation.state = currentLocation.state || Object.create(null);
		if (supportPageOffset) {
			currentLocation.state.scrollX = window.pageXOffset;
			currentLocation.state.scrollY = window.pageYOffset;
		} else {
			currentLocation.state.scrollX = isCSS1Compat ?
				document.documentElement.scrollLeft : document.body.scrollLeft;
			currentLocation.state.scrollY = isCSS1Compat ?
				document.documentElement.scrollTop : document.body.scrollTop;
		}
	};

	addEventListener(window, 'scroll', setPageOffset);
	addEventListener(window, 'pagehide', () => {
		removeEventListener(window, 'scroll', setPageOffset);
		unlisten();
	});
}

// Run the application when both DOM is ready
// and page content is loaded
if (window.addEventListener) {
	window.addEventListener('DOMContentLoaded', run);
} else {
	window.attachEvent('onload', run);
}

