import ApiStore from './ApiStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import LayerGroupModel from '../models/LayerGroupModel';

//import UserStore from './UserStore';
import logger from '../core/Logger';

class LayerGroupStore extends ApiStore {

	getApiUrl(){
		return "/rest/layergroup";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
	}

	getInstance(options,data){
		return new LayerGroupModel(options,data);
	}
}

let storeInstance = new LayerGroupStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	logger.trace("LayerGroupStore# received(), Action: ", action);

	switch(action.type) {
		case ActionTypes.LAYER_GROUP_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.LAYER_GROUP_HANDLE:
			storeInstance.handle(action.data, action.operationId);
			break;
		default:
			return;
	}

});

export default storeInstance;
