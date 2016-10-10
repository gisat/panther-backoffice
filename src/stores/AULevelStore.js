import ApiStore from './ApiStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import AULevelModel from '../models/AULevelModel';

//import UserStore from './UserStore';
import LayerGroupStore from './LayerGroupStore';
import StyleStore from './StyleStore';
import TopicStore from './TopicStore';
import logger from '../core/Logger';

class AULevelStore extends ApiStore {

	getApiUrl(){
		return "/rest/areatemplate";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
		this.changeListener.add(LayerGroupStore);
		this.changeListener.add(StyleStore);
		this.changeListener.add(TopicStore);
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
	logger.trace("AULevelStore# received(), Action: ", action);

	switch(action.type) {
		case ActionTypes.AU_LEVEL_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash, action.instanceId);
			break;
		case ActionTypes.AU_LEVEL_HANDLE:
			storeInstance.handle(action.data, action.operationId);
			break;
		default:
			return;
	}

});

export default storeInstance;
