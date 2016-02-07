import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import AULevelModel from '../models/AULevelModel';

class AULevelStore extends Store {

	getApiUrl(){
		return "/rest/areatemplate";
	}
	getInstance(options,data){
		if(data) {
			if (data.layerType=="au") {
				return new AULevelModel(options,data);
			}
		}
		else {
			if(options) {
				options.layerType = "au";
				return new AULevelModel(options);
			}
		}
		return null;
	}
}

let storeInstance = new AULevelStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		//case ActionTypes.APP_INITIALIZED:
		//	reset();
		//	break;
		//case ActionTypes.LAYER_ADD:
		//	//appState.page = action.page;
		//	//appState.path = action.path;
		//	console.log("Action: LAYER_ADD");
		//	break;
		default:
			return;
	}

	storeInstance.emitChange();

});

export default storeInstance;
