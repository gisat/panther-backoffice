import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import ObjectRelationModel from '../models/ObjectRelationModel';

class ObjectRelationStore extends Store {

	getApiUrl(){
		return "/rest/layerref";
	}
	getInstance(data){
		return new ObjectRelationModel(data);
	}
}

let storeInstance = new ObjectRelationStore();

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
