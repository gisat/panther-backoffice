import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import LayerGroupModel from '../models/LayerGroupModel';

class LayerGroupStore extends Store {

	getApiUrl(){
		return "/rest/layergroup";
	}

	getInstance(options,data){
		return new LayerGroupModel(options,data);
	}
}

let storeInstance = new LayerGroupStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.LAYER_GROUP_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.LAYER_GROUP_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

});

export default storeInstance;
