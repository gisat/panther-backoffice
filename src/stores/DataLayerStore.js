import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import DataLayerModel from '../models/DataLayerModel';

import ObjectRelationStore from './ObjectRelationStore';


class DataLayerStore extends Store {

	getApiUrl(){
		return "api/layers/getLayers";
	}

	getApiLoadMethod(){
		return "POST";
	}

	registerListeners(){
		this.changeListener.add(ObjectRelationStore);
	}

	getInstance(options,data){
		if(data && data.isWms) {
			return null;
		}
		else {
			return new DataLayerModel(options,data);
		}
	}

}

let storeInstance = new DataLayerStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		//case ActionTypes.APP_INITIALIZED:
		//	reset();
		//	break;
		case ActionTypes.LAYER_ADD: //todo
			//appState.page = action.page;
			//appState.path = action.path;
			console.log("Action: LAYER_ADD");
			break;

		// case ActionTypes.APP_RESET:
		//   reset();
		//   break;

		// case ActionTypes.POUCH_ERROR:
		//   appState.message = 'Local database error: ' + action.error.message;
		//   break;

		default:
			return;
	}

	storeInstance.emitChange();

});

export default storeInstance;
