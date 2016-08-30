import ApiStore from './ApiStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import DataLayerModel from '../models/DataLayerModel';

import ObjectRelationStore from './ObjectRelationStore';
import logger from '../core/Logger';

class DataLayerStore extends ApiStore {

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
	logger.info("DataLayerStore# dispatchToken(), Action:", action);
});

export default storeInstance;
