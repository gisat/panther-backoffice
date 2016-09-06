import ApiStore from './ApiStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import VectorLayerModel from '../models/VectorLayerModel';

//import UserStore from './UserStore';
import LayerGroupStore from './LayerGroupStore';
import StyleStore from './StyleStore';
import TopicStore from './TopicStore';
import logger from '../core/Logger';

class VectorLayerStore extends ApiStore {

	getApiUrl(){
		return "/rest/areatemplate";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
		this.changeListener.add(LayerGroupStore);
		this.changeListener.add(StyleStore);
		this.changeListener.add(TopicStore);
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
	logger.trace("VectorLayerStore# received(), Action: ", action);

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

});

export default storeInstance;
