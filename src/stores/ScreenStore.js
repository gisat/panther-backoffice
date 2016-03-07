import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import utils from '../utils/utils';

import _ from 'underscore';

import ScreenAnalysesBase from '../components/screens/ScreenAnalysesBase';
import ScreenAnalysisSpatial from '../components/screens/ScreenAnalysisSpatial';
import ScreenAnalysisSpatialRules from '../components/screens/ScreenAnalysisSpatialRules';

import ScreenDashboardBase from '../components/screens/ScreenDashboardBase';

import ScreenDataLayersBase from '../components/screens/ScreenDataLayersBase';

import ScreenMetadataBase from '../components/screens/ScreenMetadataBase';
import ScreenMetadataLayerVector from '../components/screens/ScreenMetadataLayerVector';

import ScreenPlacesBase from '../components/screens/ScreenPlacesBase';
import ScreenPlaceDataSourceAttSet from '../components/screens/ScreenPlaceDataSourceAttSet';


var initialScreenSets = {
	analyses: {
		title: "Analyses",
		screens: {
			ScreenAnalysesBase: {
				order: 0,
				component: ScreenAnalysesBase
			},
			ScreenAnalysisSpatial: {
				order: 1,
				size: 40,
				position: "retracted",
				component: ScreenAnalysisSpatial,
				parentUrl: "/analyses/spatial"
			},
			ScreenAnalysisSpatialRules: {
				order: 2,
				size: 80,
				position: "retracted",
				component: ScreenAnalysisSpatialRules
			}
		}
	},

	dashboard: {
		title: "Dashboard",
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
		screens: {
			ScreenDataLayersBase: {
				order: 0,
				component: ScreenDataLayersBase
			}
		}
	},

	metadata: {
		title: "Metadata structures",
		screens: {
			ScreenMetadataBase: {
				order: 0,
				component: ScreenMetadataBase
			}
		}
	},

	places: {
		title: "Places",
		screens: {
			ScreenPlacesBase: {
				order: 0,
				component: ScreenPlacesBase
			},
			ScreenPlaceDataSourceAttSet: {
				order: 1,
				size: 40,
				position: "retracted",
				component: ScreenPlaceDataSourceAttSet
			}
		}
	}
};


class ScreenStore extends Store {

	constructor() {
		super();		//this._models = this.load();
		let thisStore = this;
		this._models.then(function(){
			thisStore._historyStacks = thisStore.initializeHistoryStacks();
		});
	}

	getApiUrl(){
		return null;
	}
	getInstance(options,data){
		return null;
	}

	reload() {
		return null;
	}

	load() {
		this._screenSets = utils.deepClone(initialScreenSets);
		return Promise.resolve(this.getModels());
	}

	getModels() {
		let models = [], i=0;
		_.each(this._screenSets, function(screenSetObject,screenSetKey,screensets) {
			models[i] = utils.deepClone(screenSetObject);
			models[i].key = screenSetKey;
			models[i].screens = [];
			_.each(screenSetObject.screens, function(screenObject,screenKey,screens){
				screenObject.key = screenKey;
				models[i].screens[screenObject.order] = screenObject;
			});
			i++;
		});
		console.log("ss",this._screenSets);
		return models;
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

	//createObjectAndRespond(model,responseData,responseStateHash) {
	//	//console.log("PeriodStore createObject responseData",responseData);
	//	// todo ? Model.resolveForServer ?
	//	//var object = {
	//	//	name: objectData.name,
	//	//	active: false
	//	//};
	//	var thisStore = this;
	//	var resultPromise = this.create(model);
	//
	//	resultPromise.then(function(result){
	//		thisStore.reload().then(function(){
	//			thisStore.emitChange();
	//			thisStore.emit(EventTypes.OBJECT_CREATED,result,responseData,responseStateHash);
	//		});
	//	});
	//}

	request(method, object){
		return null;
	}


	initializeHistoryStacks() {
		var thisStore = this;
		return new Promise(function (resolve, reject) {
			thisStore._models.then(function (models) {
				let stacks = {};
				for (var screenSet of models) {
					// create screenStack from screenSet
					stacks[screenSet.key] = [];
					screenSet.screens.map(function (screen) {
						stacks[screenSet.key].unshift({
							screen: screen, // reference, not copy
							userDidThat: true
						});
					});

					// reorder screenStack - open screens on top
					stacks[screenSet.key].sort(function (a, b) {
						if ((a.screen.position == "closed" || a.screen.position == "retracted") && b.screen.position == "open") {
							return 1;
						}
						return 0;
					});

					// write screenStack orders (index in screenSet, to determine all left from etc.)
					stacks[screenSet.key].map(function (stackRecord) {
						console.log("order before",stackRecord.screen.order );
						stackRecord.order = screenSet.screens.indexOf(stackRecord.screen);
						console.log("order after",stackRecord.order);
					});
				}
				console.log("models",models);
				console.log("stacks",stacks);
				resolve(stacks);
			});
		});
	}

}

let storeInstance = new ScreenStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	//switch(action.type) {
	//	case ActionTypes.SCREEN_CREATE_OPEN:
	//
	//		break;
	//	case ActionTypes.SCREEN_CLOSE:
	//
	//		break;
	//	default:
	//		return;
	//}

	//storeInstance.emitChange();

});

export default storeInstance;
