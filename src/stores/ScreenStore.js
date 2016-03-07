import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import utils from '../utils/utils';

import ScreenAnalysesBase from '../components/screens/ScreenAnalysesBase';
import ScreenAnalysisSpatial from '../components/screens/ScreenAnalysisSpatial';
import ScreenAnalysisSpatialRules from '../components/screens/ScreenAnalysisSpatialRules';

import ScreenDashboardBase from '../components/screens/ScreenDashboardBase';

import ScreenDataLayersBase from '../components/screens/ScreenDataLayersBase';

import ScreenMetadataBase from '../components/screens/ScreenMetadataBase';
import ScreenMetadataLayerVector from '../components/screens/ScreenMetadataLayerVector';

import ScreenPlacesBase from '../components/screens/ScreenPlacesBase';
import ScreenPlaceDataSourceAttSet from '../components/screens/ScreenPlaceDataSourceAttSet';


var initialScreenSets = [
	{
		key: "analyses",
		title: "Analyses",
		screens: [
			{
				key: "ScreenAnalysesBase",
				component: ScreenAnalysesBase
			},
			{
				key: "ScreenAnalysisSpatial",
				size: 40,
				position: "retracted",
				component: ScreenAnalysisSpatial,
				parentUrl: "/analyses/spatial"
			},
			{
				key: "ScreenAnalysisSpatialRules",
				size: 80,
				position: "retracted",
				component: ScreenAnalysisSpatialRules
			}
		]
	},

	{
		key: "dashboard",
		title: "Dashboard",
		screens: [
			{
				key: "ScreenDashboardBase",
				component: ScreenDashboardBase,
				contentAlign: "fill"
			}
		]
	},

	{
		key: "dataLayers",
		title: "Data layers",
		screens: [
			{
				key: "ScreenDataLayersBase",
				component: ScreenDataLayersBase
			}
		]
	},

	{
		key: "metadata",
		title: "Metadata structures",
		screens: [
			{
				key: "ScreenMetadataBase",
				component: ScreenMetadataBase
			}
		]
	},

	{
		key: "places",
		title: "Places",
		screens: [
			{
				key: "ScreenPlacesBase",
				component: ScreenPlacesBase
			},
			{
				key: "ScreenPlaceDataSourceAttSet",
				size: 40,
				position: "retracted",
				component: ScreenPlaceDataSourceAttSet
			}
		]
	}
];


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
		return Promise.resolve(utils.deepClone(initialScreenSets));
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
						stackRecord.order = screenSet.screens.indexOf(stackRecord.screen);
					});
				}
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
