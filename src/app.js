/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel-core/polyfill';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import Router from './routes';
import Location from './core/Location';
import { addEventListener, removeEventListener } from './utils/DOMUtils';
import ga from 'react-ga';
import update from 'react-addons-update';

import { googleAnalyticsId } from './config';

import utils from './utils/utils';

let cssContainer = document.getElementById('css');
const appContainer = document.getElementById('app');

var activePageKey = null;
const context = {
	setStateDeep: function(updatePath){
		//console.log("@ setStateDeep this", this);
		if(this.mounted) {
			this.setState(update(this.state, updatePath));
		} else {
			console.log("Tries to update deep state " + updatePath);
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


	setStateFromStores: function(store2state,keys){
		//console.log("88888888888888888888888888888888888888");
		//console.log("setStateFromStores()");
		var setAll = false;
		//console.log("keys:",keys);
		if(!keys){
			keys = [];
			setAll = true;
		}
		//console.log("keys:",keys);
		var component = this;
		var storeLoads = [];
		var storeNames = [];
		for(var name in store2state){
			if(setAll || (keys.indexOf(name)!=-1)) {
				//console.log("name:",name);
				//console.log(keys.indexOf(name));
				storeLoads.push(store2state[name]);
				// todo to clone or not to clone, that is the question
				//storeLoads.push(utils.deepClone(store2state[name]));
				storeNames.push(name);
			}
		}
		//console.log("88888888888888888888888888888888888888");
		return Promise.all(storeLoads).then(function(data){
			var storeObject = {};
			for(var i in storeNames){
				storeObject[storeNames[i]] = data[i];
			}
			if(component.mounted) {
				component.setState(storeObject);
			} else {
				console.log("Component is already unmounted." + component);
				component.render();
			}
		});
	}
};


function render(state) {
	Router.dispatch(state, (newState, component) => {
		//console.log("newState: ", newState);
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
		//console.log("currentState: ", currentState);
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

