/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel-core/polyfill';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import Router from './routes';
import Location from './core/Location';
import { addEventListener, removeEventListener } from './utils/DOMUtils';
import ga from 'react-ga';
import { googleAnalyticsId } from './config';

const screenStack = require('./stores/screenStack');

let cssContainer = document.getElementById('css');
const appContainer = document.getElementById('app');

var activePageKey = null;
const context = {
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
	 * onSetScreenData generates function for sending state data between screens.
	 * Use:
	 * - callback: onClick={this.context.onSetScreenData("analyses2", {id: 42})}
	 * - directly: this.context.onSetScreenData("analyses2", {id: 42})()
	 * @param screenKey
	 * @param data (object)
	 * @returns function
	 */
	onSetScreenData: function(screenKey, data){
		return function(){
			var page = this;
			var index = -1;
			//console.log("SET-SCREEN-DATA ", screenKey);
			page.state.screens.map(function (obj, i) {
				if (obj.key == screenKey) {
					index = i;
				}
			});
			//console.log("SET-SCREEN-DATA index", index);
			if (index == -1) return false;
			var newScreens = page.state.screens.slice(0);
			for (var key in data) {
				newScreens[index].data[key] = data[key];
			}
			//console.log("newScreens:", newScreens);
			page.setState({
				screens: newScreens
			});
		}.bind(this)
	},

	setStateFromStores: function(store2state){
		var me = this;
		var storeLoads = [];
		var storeNames = [];
		for(var name in store2state){
			storeLoads.push(store2state[name]);
			storeNames.push(name);
		}
		Promise.all(storeLoads).then(function(data){
			var storeObject = {};
			for(var i in storeNames){
				storeObject[storeNames[i]] = data[i];
			}
			me.setState(storeObject);
		});
	},

	setScreenPosition: function(screenKey, positionClass, options){
		options = options || {};
		var page = this;
		// clone state screen array
		var newScreens = page.state.screens.slice(0);
		var index = -1;
		screenStack[page.state.key] = screenStack[page.state.key] || [];


		//////////////// log
		console.log("");
		console.log("###sSP  ["+screenKey+" » "+positionClass+"]  options:", options);
		//console.log("this class: "+this.constructor.name);
		var log = " /Stack: ";
		screenStack[page.state.key].map(function(screen, i){
			log += " [" + i + "]" + screen.key + " " + screen.position;
			//if(!screen.allowRetract) log += "/xR";
			if(screen.userDidThat) log += "/U";
			log += "{"+screen.order+"}";
		});
		console.log(log);
		log = "/ STATE: ";
		newScreens.map(function(screen){
			log += screen.key + " " + screen.position + "(" + (screen.disabled ? "DIS":"en") + ") | ";
		});
		console.log(log);
		//////////////// log

		if(typeof screenKey != 'undefined') {

			// get index for actual screen
			newScreens.map(function (obj, i) {
				if (obj.key == screenKey) {
					index = i;
				}
			});

			/////////// set new position class (open, retracted, closed) ///////////
			newScreens[index].position = positionClass;

			resetScreenWidth(screenKey, newScreens);

			// handle disabled
			switch (positionClass) {
				case "closed":
					// when closing, delete screen from state after a while
					setTimeout(function () {
						delete newScreens[index];
						page.setState({
							screens: newScreens
						});
					}, 1000);
				case "retracted":
					// when closing OR RETRACTING, disable content of the screen
					newScreens[index].disabled = true;
					break;
				case "open":
					// when opening, enable content
					newScreens[index].disabled = false;
			}


			////// log user operation to screenStack
			// remove previous records for the same screen
			//var allowRetract = (newScreens[0].key != screenKey); // Zatim nepouzivane, mozna to nebude potreba.
			screenStack[page.state.key].map(function(record, i){
				if(record.key == screenKey){
					//allowRetract = record.allowRetract;
					screenStack[page.state.key].splice(i, 1);
				}
			});
			// add record for this operation
			if(positionClass == "open" || positionClass == "retracted"){
				screenStack[page.state.key].unshift({
					key: screenKey,
					position: positionClass,
					//allowRetract: allowRetract
					userDidThat: true
				});
			}

			// reindex screenStack orders
			screenStack[page.state.key].map(function(record){
				newScreens.map(function(stateRecord, stateIndex){
					if(stateRecord.key == record.key) record.order = stateIndex;
				});
			});
		}


		var menuWidth = 3.75;
		var retractedWidth = 5;
		var constPlus = 1;
		var normalWidth = 50;
		var remSize = 16;
		var availableWidth = window.innerWidth / remSize - menuWidth - screenStack[page.state.key].length * retractedWidth;
		console.log("        =init innerWidth:" + window.innerWidth / remSize + " availableWidth:"+availableWidth);

		var retractAllFurther = false;
		var retractAllLeftFrom = 0;
		var current = true; // first record in the screenStack is the screen which has been opened or retracted by user
		var foundOpen = false;
		screenStack[page.state.key].map(function (record) {

			var screenState = $.grep(newScreens, function (e) {
				if (typeof e == "undefined") return false;
				return e.key == record.key;
			})[0];

			var screenSize = screenState.size || normalWidth;
			var realScreenSize = screenSize + constPlus - retractedWidth;
			console.log("        =record "+record.key+"-"+record.position+"    size:"+screenState.size+"->"+screenSize+"->"+realScreenSize);
			switch (positionClass) {
				case "open":
					if (record.position == "open") {

						if(retractAllFurther || record.order < retractAllLeftFrom) {
							retractScreen(record.key, newScreens);
							record.position = "retracted";
							record.userDidThat = false;

						// fits partly or not at all
						}else if ((availableWidth - realScreenSize) < 0) {

							if(current){
								maximiseScreen(record.key, newScreens);
								page.state.hasMaximised = true;
							}else{

								disableScreen(record.key, newScreens);

								// doesn't fit at all
								if (availableWidth < 0) {
									retractScreen(record.key, newScreens);
									record.position = "retracted";
									record.userDidThat = false;
								}else{
									reduceScreenWidth(record.key, availableWidth + retractedWidth, newScreens);
								}

							}

						}

						//if (typeof size == "undefined") retractAllFurther = true;
						if(screenState.contentAlign == "fill") retractAllFurther = true;
						if(typeof screenState.size == "undefined") retractAllLeftFrom = Math.max(retractAllLeftFrom, record.order);

					} else if (record.position == "retracted") {
						// asi nic?
					}
					break;
				case "closed":
					current = false; // Beacause when screen has been closed, it's no more in the screenStack
				case "retracted":
					page.state.hasMaximised = false;

					if (record.position == "open") {
						foundOpen = true;

						if ((availableWidth - realScreenSize) >= 0) { //  || typeof size == "undefined"
							// enable
							enableScreen(record.key, newScreens);
						}else{
							// disable
							reduceScreenWidth(record.key, availableWidth + retractedWidth, newScreens);
							disableScreen(record.key, newScreens);
							retractAllFurther = true;
						}

					} else if (record.position == "retracted") {
						if (availableWidth >= 0 && !current && !retractAllFurther &&  !(record.order < retractAllLeftFrom) && !record.userDidThat){
							// open
							openScreen(record.key, newScreens);
							record.position = "open";
							record.userDidThat = false;
							if ((availableWidth - realScreenSize) >= 0) {
								// enable
								enableScreen(record.key, newScreens);
							}else if(!foundOpen){
								// enable
								enableScreen(record.key, newScreens);
								// maximise
								maximiseScreen(record.key, newScreens);
								page.state.hasMaximised = true;
								retractAllFurther = true;
							}else{
								// disable
								disableScreen(record.key, newScreens);
								reduceScreenWidth(record.key, availableWidth + retractedWidth, newScreens);
								retractAllFurther = true;
							}
							foundOpen = true;
						}
					}
					if (!current && typeof screenState.size == "undefined") retractAllLeftFrom = record.order; // todo: nema se to testovat jenom pro otevrene?
					if (!current && screenState.contentAlign == "fill") retractAllFurther = true;
			}

			if (current) record.userDidThat = true;
			if (record.position == "open") availableWidth -= realScreenSize;
			console.log("         ======= availableWidth:"+availableWidth);
			current = false;
		});


		// reorder screenStack to be open-first when init run
		if(options.init){
			//console.log("| / screenStack[me.state.key][0].key:", screenStack[me.state.key][0].key);
			screenStack[page.state.key].sort(function(a, b){
				if((a.position == "closed" || a.position == "retracted") && b.position == "open"){
					return 1;
				}
				return 0;
			});
			//console.log("| \\ screenStack[me.state.key][0].key:", screenStack[me.state.key][0].key);
		}


		//////////////// log
		log = "\\ Stack: ";
		screenStack[page.state.key].map(function(screen, i){
			log += " [" + i + "]" + screen.key + " " + screen.position;
			//if(!screen.allowRetract) log += "/xR";
			if(screen.userDidThat) log += "/U";
			log += "{"+screen.order+"}";
		});
		console.log(log);
		log = " \\STATE: ";
		newScreens.map(function(screen){
			log += screen.key + " " + screen.position + "(" + (screen.disabled ? "DIS":"enb") + ") | ";
		});
		console.log(log);
		//console.log("  ----------------------------");
		//////////////// log



		// apply changes of state
		page.setState({
			screens: newScreens
		});

	}
};

function resetScreenWidth(screenKey, pageStateScreenArray){
	reduceScreenWidth(screenKey, null, pageStateScreenArray);
}

function reduceScreenWidth(screenKey, width, pageStateScreenArray){
	pageStateScreenArray.map(function(obj){
		if(obj.key == screenKey){
			if(width === null){
				obj.forceWidth = null;
			}else if(!obj.forceWidth) {
				obj.forceWidth = width;
			}else{
				obj.forceWidth = Math.min(obj.forceWidth, width);
			}
		}
	});
}

function retractScreen(screenKey, pageStateScreenArray){
	resetScreenWidth(screenKey, pageStateScreenArray);
	update2DArray(pageStateScreenArray, "key", screenKey, "position", "retracted");
}

function openScreen(screenKey, pageStateScreenArray){
	update2DArray(pageStateScreenArray, "key", screenKey, "position", "open");
}

//function closeScreen(){
//  resetScreenWidth(screenKey, pageStateScreenArray);
//}

function maximiseScreen(screenKey, pageStateScreenArray){
	//pageStateScreenArray.map(function(screen){
	//  if(screen.key == screenKey && screen.position.match(/ maximised$/i)) screen.position += " maximised";
	//});
	resetScreenWidth(screenKey, pageStateScreenArray);
	update2DArray(pageStateScreenArray, "key", screenKey, "position", "open maximised");
}

function disableScreen(screenKey, pageStateScreenArray){
	update2DArray(pageStateScreenArray, "key", screenKey, "disabled", true);
}

function enableScreen(screenKey, pageStateScreenArray){
	resetScreenWidth(screenKey, pageStateScreenArray);
	update2DArray(pageStateScreenArray, "key", screenKey, "disabled", false);
}

function update2DArray(theArray, testKey, testValue, setKey, setValue){
	theArray.map(function(obj){
		if(obj[testKey] == testValue){
			obj[setKey] = setValue;
		}
	});
}


function render(state) {
	Router.dispatch(state, (newState, component) => {
		console.log("newState: ", newState);
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
		console.log("currentState: ", currentState);
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

