import ApiStore from './ApiStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import AttributeModel from '../models/AttributeModel';

import logger from '../core/Logger';
//import UserStore from './UserStore';


class AttributeStore extends ApiStore {

	getApiUrl(){
		return "/rest/attribute";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
	}

	getInstance(options,data){
		return new AttributeModel(options,data);
	}
}

let storeInstance = new AttributeStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	logger.trace("AttributeStore# received(), Action: ", action);

	switch(action.type) {
		case ActionTypes.ATTRIBUTE_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.ATTRIBUTE_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

});

export default storeInstance;
