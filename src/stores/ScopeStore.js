import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import ScopeModel from '../models/ScopeModel';

class ScopeStore extends Store {

	getApiUrl(){
		return "/rest/dataset";
	}
	getInstance(options,data){
		return new ScopeModel(options,data);
	}
}

let storeInstance = new ScopeStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.SCOPE_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		default:
			return;
	}

	storeInstance.emitChange();

});

export default storeInstance;
