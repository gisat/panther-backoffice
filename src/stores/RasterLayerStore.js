import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import RasterLayerModel from '../models/RasterLayerModel';

class RasterLayerStore extends Store {

	getApiUrl(){
		return "/rest/areatemplate";
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
