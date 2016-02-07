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
