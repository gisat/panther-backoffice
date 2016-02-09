import Store from './Store';
//import AppDispatcher from '../dispatcher/AppDispatcher';
//import ActionTypes from '../constants/ActionTypes';

import VectorLayerStore from './VectorLayerStore';
import RasterLayerStore from './RasterLayerStore';
import AULevelStore from './AULevelStore';

class GeneralLayerStore extends Store {

	load() {
		return new Promise(function(resolve,reject) {
			var vectorLayers = VectorLayerStore.getAll();
			var rasterLayers = RasterLayerStore.getAll();
			var auLayers = AULevelStore.getAll();
			Promise.all([vectorLayers,rasterLayers,auLayers]).then(function(values){
				var allLayers = values[0].concat(values[1],values[2]);
				resolve(allLayers);
			});
		});
	}

	getById(id) {
		return new Promise(function(resolve,reject) {
			var vectorPromise = VectorLayerStore.getById(id);
			var rasterPromise = RasterLayerStore.getById(id);
			var auPromise = AULevelStore.getById(id);
			Promise.all([vectorPromise,rasterPromise,auPromise]).then(function([vector,raster,au]){
				if(vector) resolve(vector);
				if(raster) resolve(raster);
				if(au) resolve(au);
				if(!vector && !raster && !au) resolve(null);
			});
		});
	}

	getFiltered(options) {
		return new Promise(function(resolve,reject) {
			var vectorPromise = VectorLayerStore.getFiltered(options);
			var rasterPromise = RasterLayerStore.getFiltered(options);
			var auPromise = AULevelStore.getFiltered(options);
			Promise.all([vectorPromise,rasterPromise,auPromise]).then(function([vector,raster,au]){
				resolve(vector.concat(raster,au));
			});
		});
	}

	// todo getFiltered()

}

let storeInstance = new GeneralLayerStore();

//storeInstance.dispatchToken = AppDispatcher.register(action => {
//
//	switch(action.type) {
//		//case ActionTypes.APP_INITIALIZED:
//		//	reset();
//		//	break;
//		//case ActionTypes.LAYER_ADD:
//		//	//appState.page = action.page;
//		//	//appState.path = action.path;
//		//	console.log("Action: LAYER_ADD");
//		//	break;
//		default:
//			return;
//	}
//
//	storeInstance.emitChange();
//
//});

export default storeInstance;
