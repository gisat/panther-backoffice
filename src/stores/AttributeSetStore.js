import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import AttributeSetModel from '../models/AttributeSetModel';

class AttributeSetStore extends Store {

	getApiUrl(){
		return "/rest/attributeset";
	}

	getInstance(options,data){
		return new AttributeSetModel(options,data);
	}
}

let storeInstance = new AttributeSetStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.ATTRIBUTE_SET_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.ATTRIBUTE_SET_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

});

export default storeInstance;
