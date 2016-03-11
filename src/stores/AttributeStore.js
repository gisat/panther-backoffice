import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import AttributeModel from '../models/AttributeModel';

class AttributeStore extends Store {

	getApiUrl(){
		return "/rest/attribute";
	}

	getInstance(options,data){
		return new AttributeModel(options,data);
	}
}

let storeInstance = new AttributeStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

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
