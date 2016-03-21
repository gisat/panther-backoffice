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
		case ActionTypes.AU_LEVEL_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.AU_LEVEL_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

});

export default storeInstance;
