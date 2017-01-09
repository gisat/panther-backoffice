import superagent from 'superagent';
import path from 'path';
import { apiProtocol, apiHost, apiPath } from '../config';
import utils from '../utils/utils';

import ApiStore from './ApiStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import DataLayerModel from '../models/DataLayerModel';

import ObjectRelationStore from './ObjectRelationStore';
import logger from '../core/Logger';

class DataLayerStore extends ApiStore {

	getApiUrl(){
		return "/rest/layer";
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

	urlFor(serverPath) {
		return apiProtocol + apiHost + path.join(apiPath, serverPath).replace(/\\/g, "/");
	}

	duplicateLayer(name) {
		let path = name;
		let newName = name + this.shortUniqueId();
		return superagent
			.post(this.urlFor(this.getApiUrl()))
			.send({name: newName, path: path})
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(() => {
				logger.info('DataLayerStore#duplicateLayer Layer duplicated');
				return this.reload();
			}).catch(err => {
				this.emitError(err);
				logger.error('DataLayerStore#duplicateLayer Error: ',err);
			});
	}

	shortUniqueId() {
		return (Math.random() * new Date().getMilliseconds()).toFixed(0);
	}
}

let storeInstance = new DataLayerStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	logger.info("DataLayerStore# dispatchToken(), Action:", action);

	if(action.type == ActionTypes.DUPLICATE_LAYER) {
		storeInstance.duplicateLayer(action.data.name);
	}
});

export default storeInstance;
