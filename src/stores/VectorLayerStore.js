import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import VectorLayerModel from '../models/VectorLayerModel';

class VectorLayerStore extends Store {

	getApiUrl(){
		return "/rest/areatemplate";
	}
	getInstance(options,data){
		// for now we have non-raster layers (vector + AU levels)
		if(data && !data.justVisualization) {
			return new VectorLayerModel(options,data);
		}
		else {
			return null;
		}
	}
}

let storeInstance = new VectorLayerStore();

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
