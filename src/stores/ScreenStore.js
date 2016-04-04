import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import utils from '../utils/utils';

import _ from 'underscore';
import ga from 'react-ga';

import ScreenAnalysesBase from '../components/screens/ScreenAnalysesBase';
import ScreenAnalysisSpatial from '../components/screens/ScreenAnalysisSpatial';
import ScreenAnalysisRulesSpatial from '../components/screens/ScreenAnalysisRulesSpatial';
import ScreenAnalysisRulesLevel from '../components/screens/ScreenAnalysisRulesLevel';
import ScreenAnalysisRulesMath from '../components/screens/ScreenAnalysisRulesMath';

import ScreenDashboardBase from '../components/screens/ScreenDashboardBase';

import ScreenDataLayersBase from '../components/screens/ScreenDataLayersBase';

import ScreenMetadataBase from '../components/screens/ScreenMetadataBase';
import ScreenMetadataLayerVector from '../components/screens/ScreenMetadataLayerVector';

import ScreenPlacesBase from '../components/screens/ScreenPlacesBase';
import ScreenPlaceDataSourceAttSet from '../components/screens/ScreenPlaceDataSourceAttSet';


var initialScreenSets = {
	analyses: {
		title: "Analyses",
		hasMaximised: false,
		screens: {
			ScreenAnalysesBase: {
				order: 0,
				component: ScreenAnalysesBase
			},
			// ScreenAnalysisRulesSpatial: {
			// 	order: 2,
			// 	size: 80,
			// 	position: "retracted",
			// 	component: ScreenAnalysisRulesSpatial
			// },
			// ScreenAnalysisRulesLevel: {
			// 	order: 3,
			// 	size: 60,
			// 	position: "retracted",
			// 	component: ScreenAnalysisRulesLevel
			// },
			// ScreenAnalysisRulesMath: {
			// 	order: 4,
			// 	size: 80,
			// 	position: "retracted",
			// 	component: ScreenAnalysisRulesMath
			// }
		}
	},

	dashboard: {
		title: "Dashboard",
		hasMaximised: false,
		screens: {
			ScreenDashboardBase: {
				order: 0,
				component: ScreenDashboardBase,
				contentAlign: "fill"
			}
		}
	},

	dataLayers: {
		title: "Data layers",
		hasMaximised: false,
		screens: {
			ScreenDataLayersBase: {
				order: 0,
				component: ScreenDataLayersBase
			}
		}
	},

	metadata: {
		title: "Metadata structures",
		hasMaximised: false,
		screens: {
			ScreenMetadataBase: {
				order: 0,
				component: ScreenMetadataBase
			}
		}
	},

	places: {
		title: "Places",
		hasMaximised: false,
		screens: {
			ScreenPlacesBase: {
				order: 0,
				component: ScreenPlacesBase
			}
		}
	}
};


class ScreenStore extends Store {

	constructor() {
		super();		//this._models = this.load();
		let thisStore = this;
		this._models.then(function(){
			thisStore._historyStacks = thisStore.generateHistoryStacks();
		});
	}

	load() {
		this._screenSets = utils.deepClone(initialScreenSets);
		return Promise.resolve(this.generateModels());
	}

	/**
	 * generate models from _screenSets (or updated/cloned version) for use with store get methods
	 * @returns {Array}
	 */
	generateModels(screenSets) {
		screenSets = screenSets || this._screenSets;
		let models = [], i=0;
		_.each(screenSets, function(screenSetObject,screenSetKey,screensets) {
			models[i] = utils.deepClone(screenSetObject);
			models[i].key = screenSetKey;
			models[i].screens = [];
			_.each(screenSetObject.screens, function(screenObject,screenKey,screens){
				screenObject.key = screenKey;
				models[i].screens[screenObject.order] = screenObject; // reference, not copy
			});
			i++;
		});
		return models;
	}

	/**
	 * generate history from _screenSets (or updated/cloned version)
	 * @param screenSets
	 * @returns {{}}
	 */
	generateHistoryStacks(screenSets) {
		screenSets = screenSets || this._screenSets;
		var thisStore = this;
		let stacks = {};

		_.each(screenSets, function(screenSetObject, screenSetKey){
			// create this._historyStacks from screenSet
			stacks[screenSetKey] = [];
			_.mapObject(screenSetObject.screens,function (screenObject, screenKey) {
				stacks[screenSetKey].unshift({
					screen: screenObject, // reference, not copy
					userDidThat: true
				});
			});
			// reorder this._historyStacks - open screens on top // todo does this work?
			stacks[screenSetKey].sort(function (a, b) {
				if ((a.screen.position == "closed" || a.screen.position == "retracted") && b.screen.position == "open") {
					return 1;
				}
				return 0;
			});
		});
		return stacks;
	}

	/**
	 * recompute physical screen order (in _models = in interface)
	 * @param screenSetKey
	 */
	updateOrder(screenSetKey) {
		var modelPromise = this.getById(screenSetKey);
		modelPromise.then(function(model){
			_.each(model.screens, function(screen, screenIndex, screens){
				screen.order = screenIndex;
			});
		});

	}

	addFocusListener(callback) {
		this.on(EventTypes.SCREEN_FOCUS, callback);
		//this.on(EventTypes.OBJECT_CREATE_FAILED, callback); //etc
	}

	removeFocusListener(callback) {
		this.removeListener(EventTypes.SCREEN_FOCUS, callback);
	}

	// methods not used with this store

	reload() {
		return null;
	}

	getApiUrl(){
		return null;
	}
	getInstance(options,data){
		return null;
	}

	create(model) {
		return null;
	}

	update(model) {
		return null;
	}

	delete(model) {
		return null;
	}

	handle(actionData) {
		return null;
	}

	createObjectAndRespond(model,responseData,responseStateHash) {
		return null;
	}

	request(method, object){
		return null;
	}

	/**
	 * get screen object (REFERENCE!) from screen key
	 * @param screenKey
	 * @returns {*}
	 */
	getScreen(screenKey) {
		if (screenKey) {
			let screen = null;
			_.each(this._screenSets, function(screenSet){
				if (screenSet.screens.hasOwnProperty(screenKey)) {
					screen = screenSet.screens[screenKey];
				}
			}, this);
			return screen;
		}
	}

	/**
	 * get screenSet (reference?) from screen key
	 * @param screenKey
	 */
	getScreenScreenSet(screenKey) {
		if(screenKey) {
			return _.find(this._screenSets,function(screenSet){
				return !!screenSet.screens[screenKey];
			});
		}
	}

	/**
	 * get screenSet key from screen key
	 * @param screenKey
	 */
	getScreenScreenSetKey(screenKey) {
		if(screenKey) {
			return _.findKey(this._screenSets,function(screenSet){
				return !!screenSet.screens[screenKey];
			});
		}
	}

	/**
	 * open screen (create if doesn't exist), send data
	 * @param screenKey
	 * @param screenSetKey
	 * @param options - object with screen properties. Only used when creating new
	 * @param responseData - object sent with event on completion
	 * @param responseHash - hash sent with event on completion
	 */
	createOpenScreen(screenKey, screenSetKey, options, responseData, responseHash) {
		var thisStore = this;
		let screen = this.getScreen(screenKey);
		if (screen && screen != null) {

			// screen already exists -> send data, throw the rest away
			// (it should be the same, and if not, we don't want to change it)
			screen.data = screen.data || {};
			_.assign(screen.data,options.data);
			this.setScreenPosition(screenKey,"open");
			//this.emit(EventTypes.SCREEN_OPENED,screenKey,responseData,responseHash);
			this.emit(EventTypes.SCREEN_FOCUS,screenKey);

		} else {

			// screen does not exist -> create it
			let order = -1;
			_.mapObject(this._screenSets[screenSetKey].screens,function(screenObject, screenKey){
				order = Math.max(order,screenObject.order);
			});
			order++;
			screen = {
				key: screenKey,
				component: options.component || React.createElement('div'),
				parentUrl: options.parentUrl || "",
				position: "closed",
				size: options.size,
				contentSize: options.contentSize,
				order: order,
				data: options.data
			};
			this._screenSets[screenSetKey].screens[screenKey] = screen;
			this._models = Promise.resolve(this.generateModels());
			this._historyStacks[screenSetKey].unshift({
				screen: screen,
				userDidThat: true
			});
			this.emitChange(); // add closed screen
			setTimeout(function(){
				//ActionCreator
				thisStore.setScreenPosition(screenKey,"open");
				//this.emit(EventTypes.SCREEN_OPENED,responseData,responseHash);
				thisStore.emit(EventTypes.SCREEN_FOCUS,screenKey);
			},100);
		}
	}

	/**
	 * remove screen from _screenSets, _models & _historyStacks
	 * @param screenKey
	 */
	removeScreen(screenKey) {
		var thisStore = this;
		this._models.then(function(models){

			let screenSetKey = thisStore.getScreenScreenSetKey(screenKey);

			delete thisStore._screenSets[screenSetKey].screens[screenKey];

			let stack = _.findWhere(thisStore._historyStacks, {key: screenSetKey});
			stack = _.reject(stack,function(screen){
				return screen.key == screenKey;
			});

			let model = _.findWhere(models, {key: screenSetKey});
			model.screens = _.reject(model.screens,function(screen){
				return screen.key == screenKey;
			});

			thisStore.updateOrder(screenSetKey);

			thisStore.emitChange();

		});
	}

	/**
	 * move screen to top of history stack on interaction in it
	 * @param screenKey
	 */
	logScreenActivity(screenKey) {
		let screenSetKey = this.getScreenScreenSetKey(screenKey);
		if (screenSetKey) {
			let historyStack = this._historyStacks[screenSetKey];
			let screen = null;
			if (!this._focusedScreenKey || this._focusedScreenKey!=screenKey) {

				historyStack.map (function(record, i) {
					if (record.screen.key == screenKey) {
						screen = record.screen;
						historyStack.splice(i, 1);
					}
				});
				historyStack.unshift({
					screen: screen,
					userDidThat: true
				});

				ga.pageview(screenKey); // todo with url

				this._focusedScreenKey = screenKey;
			}
		}
	}




	reduceScreenWidth (screen, width){
		if (width === null) {
			screen.forceWidth = null;
		} else if (!screen.forceWidth) {
			screen.forceWidth = width;
		} else {
			screen.forceWidth = Math.min(screen.forceWidth, width);
		}
	}

	/**
	 * update screen position (state of openness), determine how other screens will be affected
	 * @param screenKey
	 * @param positionClass - "open" / "retracted" / "closed"
	 * @param options - todo remove?
	 */
	setScreenPosition(screenKey, positionClass, options) {

		var thisStore = this;
		// find screen & get relevant screenSet
		var screenSet = this.getScreenScreenSet(screenKey);

		if(screenSet) {
			options = options || {};
			//var page = this;
			// clone state screen array

			// set basic objects:
			// - existing structures:
			var screenSetKey = _.findKey(this._screenSets,function(item){
				return item == screenSet;
			});
			var screen = screenSet.screens[screenKey];
			// - new structures - to be saved
			var newScreenSets = utils.deepClone(this._screenSets);
			var newModels = this.generateModels(newScreenSets);
			//var newHistoryStacks = this.generateHistoryStacks(newScreenSets);
			var newHistoryStacks = utils.deepClone(this._historyStacks);
			for (var stackKey in newHistoryStacks) {
				if(newHistoryStacks.hasOwnProperty(stackKey)){
					for (var record of newHistoryStacks[stackKey]) {
						record.screen = newScreenSets[stackKey].screens[record.screen.key];
					}
				}
			}

			var newScreenSet = _.findWhere(newModels,{key:screenSetKey});
			//var newScreens = _.clone(this._models[screenSetKey].screens);
			var newScreens = _.findWhere(newModels,{key: screenSetKey}).screens;
			var newScreen = _.findWhere(newScreens,{key: screenKey});
			//var screenSetKey = screenSetKey;
			//var newScreenSets = utils.deepClone(page.state.screenSets);

			var historyStack = newHistoryStacks[screenSetKey];
			//this._historyStacks[screenSetKey] = this._historyStacks[screenSetKey] || [];


			//////////////// log
			//console.log("");
			//console.log("###sSP  ["+screenKey+" » "+positionClass+"]  options:", options);
			////console.log("this class: "+this.constructor.name);
			//var log = " /Stack: ";
			//this._historyStacks[screenSetKey].map(function(screen, i){
			//	log += " [" + i + "]" + screen.key + " " + screen.position;
			//	//if(!screen.allowRetract) log += "/xR";
			//	if(screen.userDidThat) log += "/U";
			//	log += "{"+screen.order+"}";
			//});
			//console.log(log);
			//log = "/ STATE: ";
			//newScreens.map(function(screen){
			//	log += screen.key + " " + screen.position + "(" + (screen.disabled ? "DIS":"en") + ") | ";
			//});
			//console.log(log);
			//////////////// log



			//var index = -1;
			var index = _.indexOf(newScreens,newScreen);
			// get index for actual screen
			//newScreens.map(function (obj, i) {
			//	if (obj.key == screenKey) {
			//		index = i;
			//	}
			//});

			/////////// set new position class (open, retracted, closed) ///////////
			newScreen.position = positionClass;

			//resetScreenWidth(screenKey, newScreens);
			newScreen.forceWidth = null;

			// handle props.disabled (content disabling)
			switch (positionClass) {
				case "closed":
				case "retracted":
					newScreen.disabled = true;
					break;
				case "open":
					newScreen.disabled = false;
			}

			if(positionClass=="closed") {
				// when closing, delete screen from state after a while
				setTimeout(function () {
					thisStore.removeScreen(screenKey);
					//if(index != -1){
					//	newScreens.splice(index, 1);
					//}
					//page.setState({
					//	screens: newScreens
					//});
				}, 1000);
			}


			// moving screen to top of history - todo should be own function
			////// log user operation to this._historyStacks
			// remove previous records for the same screen
			//var allowRetract = (newScreens[0].key != screenKey); // Zatim nepouzivane, mozna to nebude potreba.
			historyStack.map(function(record, i){
				if(record.screen.key == screenKey){
					//allowRetract = record.allowRetract;
					historyStack.splice(i, 1);
				}
			});
			// add record for this operation
			if(positionClass == "open" || positionClass == "retracted"){
				historyStack.unshift({
					screen: newScreen,
					//key: screenKey,
					//position: positionClass,
					//allowRetract: allowRetract
					userDidThat: true
				});
			}

			// reindex this._historyStacks orders
			// should not be needed, we do not delete any order information anymore
			//this._historyStacks[screenSetKey].map(function(record){
			//	newScreens.map(function(stateRecord, stateIndex){
			//		if(stateRecord.key == record.key) record.order = stateIndex;
			//	});
			//});



			var menuWidth = 3.75;
			var retractedWidth = 5;
			var constPlus = 1;
			var normalWidth = 50;
			var remSize = 16;
			var windowWidth = window.innerWidth / remSize;
			var screenCount = historyStack.length;
			var availableWidth = windowWidth - menuWidth - (screenCount * retractedWidth);
			//console.log("        =init innerWidth:" + window.innerWidth / remSize + " availableWidth:"+availableWidth);

			var retractAllFurther = false;
			var retractAllLeftFrom = 0;
			var current = true; // first record in the this._historyStacks is the screen which has been opened or retracted by user
			var foundOpen = false;
			historyStack.map(function (record) {

				//var screenState = $.grep(newScreens, function (e) {
				//	if (typeof e == "undefined") return false;
				//	return e.key == record.key;
				//})[0];
				record.screen.position = record.screen.position || "open";

				var screenSize = record.screen.size || record.screen.contentSize || normalWidth;
				var realScreenSize = screenSize + constPlus - retractedWidth;
				//console.log("        =record "+record.key+"-"+record.screen.position+"    size:"+screenState.size+"->"+screenSize+"->"+realScreenSize);
				switch (positionClass) {
					case "open":
						if (record.screen.position == "open") {

							if(retractAllFurther || record.screen.order < retractAllLeftFrom) {
								//retractScreen(record.key, newScreens);
								record.screen.forceWidth = null;
								record.screen.position = "retracted";
								record.userDidThat = false;

								// fits partly or not at all
							}else if ((availableWidth - realScreenSize) < 0) {

								if(current){
									//maximiseScreen(record.key, newScreens);
									record.screen.forceWidth = null;
									record.screen.position = "open maximised";
									//page.setState({hasMaximised: true});
									newScreenSet.hasMaximised = true;
								}else{

									//disableScreen(record.key, newScreens);
									record.screen.disabled = true;

									// doesn't fit at all
									if (availableWidth < 0) {
										//retractScreen(record.key, newScreens);
										record.screen.forceWidth = null;
										record.screen.position = "retracted";
										record.userDidThat = false;
									}else{
										thisStore.reduceScreenWidth(record.screen, availableWidth + retractedWidth);
									}

								}

							}

							//if (typeof size == "undefined") retractAllFurther = true;
							if(record.screen.contentAlign == "fill") retractAllFurther = true;
							if(typeof record.screen.size == "undefined") {
								retractAllLeftFrom = Math.max(retractAllLeftFrom, record.screen.order);
							}

						} else if (record.screen.position == "retracted") {
							// asi nic?
						}
						break;
					case "closed":
						current = false; // Beacause when screen has been closed, it's no more in the this._historyStacks
					case "retracted":
						//page.setState({hasMaximised: false});
						newScreenSet.hasMaximised = false;

						if (record.screen.position == "open") {
							foundOpen = true;

							if ((availableWidth - realScreenSize) >= 0) { //  || typeof size == "undefined"
								// enable
								//enableScreen(record.key, newScreens);
								record.screen.disabled = false;
								record.screen.forceWidth = null;
							}else{
								// disable
								thisStore.reduceScreenWidth(record.screen, availableWidth + retractedWidth);
								//disableScreen(record.key, newScreens);
								record.screen.disabled = true;
								retractAllFurther = true;
							}

						} else if (record.screen.position == "retracted") {
							if (availableWidth >= 0 && !current && !retractAllFurther &&  !(record.screen.order < retractAllLeftFrom) && !record.userDidThat){
								// open
								//openScreen(record.key, newScreens);
								record.screen.position = "open";
								record.userDidThat = false;
								if ((availableWidth - realScreenSize) >= 0) {
									// enable
									//enableScreen(record.key, newScreens);
									record.screen.disabled = false;
									record.screen.forceWidth = null;
								}else if(!foundOpen){
									// enable
									//enableScreen(record.key, newScreens);
									record.screen.disabled = false;
									record.screen.forceWidth = null;
									// maximise
									//maximiseScreen(record.key, newScreens);
									record.screen.forceWidth = null;
									record.screen.position = "open maximised";
									//page.setState({hasMaximised: true});
									newScreenSet.hasMaximised = true;
									retractAllFurther = true;
								}else{
									// disable
									//disableScreen(record.key, newScreens);
									record.screen.disabled = true;
									thisStore.reduceScreenWidth(record.screen, availableWidth + retractedWidth);
									retractAllFurther = true;
								}
								foundOpen = true;
							}
						}
						if (!current && typeof newScreen.size == "undefined") retractAllLeftFrom = record.order; // todo: nema se to testovat jenom pro otevrene?
						if (!current && newScreen.contentAlign == "fill") retractAllFurther = true;
				}

				if (current) record.userDidThat = true;
				if (~record.screen.position.indexOf("open")) availableWidth -= realScreenSize;
				//console.log("         ======= availableWidth:"+availableWidth);
				current = false;
			});


			// reorder this._historyStacks to be open-first when init run
			//if(options.init){
			//	//console.log("| / this._historyStacks[me.state.key][0].key:", this._historyStacks[me.state.key][0].key);
			//	historyStack.sort(function(a, b){
			//		if((a.position == "closed" || a.position == "retracted") && b.position == "open"){
			//			return 1;
			//		}
			//		return 0;
			//	});
			//	//console.log("| \\ this._historyStacks[me.state.key][0].key:", this._historyStacks[me.state.key][0].key);
			//}


			//////////////// log
			//log = "\\ Stack: ";
			//this._historyStacks[screenSetKey].map(function(screen, i){
			//	log += " [" + i + "]" + screen.key + " " + screen.position;
			//	//if(!screen.allowRetract) log += "/xR";
			//	if(screen.userDidThat) log += "/U";
			//	log += "{"+screen.order+"}";
			//});
			//console.log(log);
			//log = " \\STATE: ";
			//newScreens.map(function(screen){
			//	log += screen.key + " " + screen.position + "(" + (screen.disabled ? "DIS":"enb") + ") | ";
			//});
			//console.log(log);
			//console.log("  ----------------------------");
			//////////////// log



			// apply changes of state
			this._screenSets = newScreenSets;
			this._historyStacks = newHistoryStacks;
			this._models = Promise.resolve(newModels);
			//newScreenSets[screenSetKey].screens = utils.deepClone(newScreens);
			//page.setState({
			//	screens: newScreens,
			//	screenSets: newScreenSets
			//});
			this.emitChange();
		}
	}


}

let storeInstance = new ScreenStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.SCREEN_CREATE_OPEN:
			storeInstance.createOpenScreen(action.screenKey,action.screenSetKey,action.options,action.responseData,action.responseHash);
			break;
		case ActionTypes.SCREEN_OPEN:
			storeInstance.setScreenPosition(action.screenKey,"open");
			break;
		case ActionTypes.SCREEN_RETRACT:
			storeInstance.setScreenPosition(action.screenKey,"retracted");
			break;
		case ActionTypes.SCREEN_CLOSE:
			storeInstance.setScreenPosition(action.screenKey,"closed");
			break;
		case ActionTypes.SCREEN_LOG_ACTIVITY:
			storeInstance.logScreenActivity(action.screenKey);
			break;
		default:
			return;
	}

});

export default storeInstance;
