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
		//if(data && !data.justVisualization) {
		if(data) {
			if (data.layerType=="vector") {
				return new VectorLayerModel(options,data);
			}
		}
		else {
			if(options) {
				options.layerType = "vector";
				return new VectorLayerModel(options);
			}
		}
		return null;
	}
}

let storeInstance = new VectorLayerStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.VECTOR_LAYER_TEMPLATE_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.VECTOR_LAYER_TEMPLATE_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

	storeInstance.emitChange();

});

export default storeInstance;
