import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import RasterLayerModel from '../models/RasterLayerModel';

import UserStore from './UserStore';
import LayerGroupStore from './LayerGroupStore';
import StyleStore from './StyleStore';
import TopicStore from './TopicStore';

import logger from '../core/Logger';


class RasterLayerStore extends Store {

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
		// areaTemplates on server with "justVisualization": true are RasterLayers on local
		//if(data && data.justVisualization) {
		if(data) {
			if (data.layerType=="raster") {
				return new RasterLayerModel(options,data);
			}
		}
		else {
			if(options) {
				options.layerType = "raster";
				return new RasterLayerModel(options);
			}
		}
		return null;
	}
}

let storeInstance = new RasterLayerStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	logger.trace("RasterLayerStore# received(), Action: ", action);

	switch(action.type) {
		case ActionTypes.RASTER_LAYER_TEMPLATE_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.RASTER_LAYER_TEMPLATE_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

});

export default storeInstance;
