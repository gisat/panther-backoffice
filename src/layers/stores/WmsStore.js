import path from 'path';
import superagent from 'superagent';

import Store from '../../stores/Store';
import AppDispatcher from '../../dispatcher/AppDispatcher';
import {apiProtocol, apiHost, apiPath} from '../../config';
import logger from '../../core/Logger';

import CommonActionTypes from '../../constants/ActionTypes';
import EventTypes from '../../constants/EventTypes';
import ActionTypes from '../constants/ActionTypes';

import WmsLayerModel from '../models/WmsLayerModel';

class WmsStore extends Store {
	constructor() {
		super();

		this.cache = null;
		this.layerUrl = this.urlFor('/rest/wms/layer');
		this.responseListeners = [];
	}

	urlFor(serverPath) {
		return apiProtocol + apiHost + path.join(apiPath, serverPath).replace(/\\/g, "/");
	}

	load(operationId) {
		if(this.cache) {
			return Promise.resolve(this.cache);
		} else {
			return this.reload(operationId);
		}
	}

	addResponseListener(listener){
		this.responseListeners.push(listener);
	}

	reload(operationId) {
		return superagent
			.get(this.layerUrl)
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(response => {
				return Promise.all(
					response.body.data.map(wmsLayerData => new WmsLayerModel(null, wmsLayerData)) || []
				);
			}).then(layers => {
				this.cache = layers || [];
				logger.info('WmsStore#reload loaded: ', this.cache);
				this.emitChange();
				return this.cache;
			}).catch(err => {
				this.emitError(err, operationId);
				logger.error('WmsStore#reload Error: ', err);
			})
	}

	add(layer, operationId) {
		logger.info('WmsStore#add Started adding layer');
		let response;
		return superagent
			.post(this.layerUrl)
			.send(layer.serialize())
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true').then(pResponse => {
				response = pResponse;
				logger.info(`WmsStore#add Wms Layer added. Body: `, response.body);
				return this.reload(operationId);
			}).then(() => {
				return response;
			}).catch(error => {
				logger.error(`WmsStore#add Error: `, error);
				this.emitError(error, operationId);
			})
	}

	update(layer, operationId) {
		logger.info('WmsStore#update Update layer');
		let response;
		return superagent
			.put(this.layerUrl)
			.send(layer.serialize())
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true').then(pResponse => {
				response = pResponse;
				logger.info('WmsStore#udpate WMS Layer updated. Body: ', response.body);
				return this.reload(operationId);
			}).then(() => {
				return response;
			}).catch(error => {
				logger.error('WmsLayer#update Error: ', error);
				this.emitError(error, operationId);
			});

	}

	delete(id, operationId) {
		logger.info('WmsStore#delete Delete layer');
		return superagent
			.delete(`${this.layerUrl}/${id}`)
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true').then(() => {
				logger.info(`WmsStore#delete Wms Layer id: ${id} deleted.`);
				return this.reload(operationId);
			}).catch(error => {
				logger.error('WmsStore#update Error: ', error);
				this.emitError(error, operationId);
			});
	}

	getAll() {
		return this.load();
	}

	getFiltered() {
		return this.load();
	}

	byId(id) {
		return this.load().then(all => {
			return all.filter(layer => layer.id == id);
		});
	}
}

let storeInstance = new WmsStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	switch(action.type) {
		case CommonActionTypes.WMS_LAYER_CREATE_RESPOND:
			storeInstance.add(action.model, action.instanceId).then(wmsLayerData => {
				let wmsLayer = new WmsLayerModel(null, wmsLayerData);
				storeInstance.emit(EventTypes.OBJECT_CREATED, wmsLayer, action.responseData, action.stateHash, action.instanceId);
			});
			break;
		case ActionTypes.WMS_LAYER_UPDATE:
			storeInstance.update(action.data.layer, action.data.operationId);
			break;
		case ActionTypes.WMS_LAYER_LOAD:
			storeInstance.load(action.data.operationId);
			break;
		case ActionTypes.WMS_LAYER_DELETE:
			storeInstance.delete(action.data.id, action.data.operationId);
			break;
	}
});

export default storeInstance;
