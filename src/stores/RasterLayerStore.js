import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import Model from '../models/RasterLayerModel';

class RasterLayerStore extends Store {

	getApiUrl(){
		return "/rest/areatemplate";
	}
	getModel(){
		return Model;
	}
}

let storeInstance = new RasterLayerStore();

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
