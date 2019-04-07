import path from 'path';
import superagent from 'superagent';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import Store  from '../../stores/Store';

import CommonActionTypes from '../../constants/ActionTypes';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../../constants/EventTypes';
import GeonodeLayerModel from '../models/GeonodeLayerModel';

import {apiProtocol, apiHost, apiPath} from '../../config';
import logger from '../../core/Logger';

/**
 * It returns all layers duplicated from the geonode layers as well as the original geonode layers. It is possible to
 * manipulate and create them here.
 */
class GeonodeStore extends Store {
	constructor() {
		super();

		this.cache = null;
		this.layerUrl = this.urlFor(`/rest/layer`);
		this.responseListener = [];
	}

	urlFor(serverPath) {
		return apiProtocol + apiHost + path.join(apiPath, serverPath).replace(/\\/g, "/");
	}

	load(operationId) {
		if (!this.cache) {
			return this.reload(operationId);
		} else {
			return Promise.resolve(this.cache);
		}
	}

	reload(operationId) {
		return superagent
			.get(this.layerUrl)
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true')
			.then(response => {
				let data = response.body.data;
				let processedLayers = data.map(geonodeLayerData => {
					return new GeonodeLayerModel(null, geonodeLayerData);
				});
				return processedLayers;
			}).then(layers => {
				this.cache = layers || [];
				logger.info('GeonodeStore#reload loaded: ', this.cache);
				this.emitChange();
				return this.cache;
			}).catch(err => {
				this.emitError(err, operationId);
				logger.error('GeonodeStore#reload Error: ', err);
			})
	}

	add(name, path, operationId) {
		logger.info('GeonodeStore#add Started adding layer');
		let response;
		return superagent
			.post(this.layerUrl)
			.send({name: name, path: path})
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true').then(pResponse => {
				response = pResponse;
				logger.info(`GeonodeStore#add Geonode Layer added. Body: `, response.body);
				return this.reload(operationId);
			}).then(() => {
				return response;
			}).catch(error => {
				logger.error(`GeonodeStore#add Error: `, error);
				this.emitError(error, operationId);
			})
	}

	update(id, name, path, operationId) {
		logger.info('GeonodeStore#update Update layer');
		let response;
		return superagent
			.put(this.layerUrl)
			.send({id: id, name: name, path: path})
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true').then(pResponse => {
				response = pResponse;
				logger.info('GeonodeStore#udpate Geonode Layer updated. Body: ', response.body);
				return this.reload(operationId);
			}).then(() => {
				return response;
			}).catch(error => {
				logger.error('GeonodeStore#update Error: ', error);
				this.emitError(error, operationId);
			});
	}

	delete(id, operationId) {
		logger.info('GeonodeStore#delete Delete layer');
		return superagent
			.delete(`${this.layerUrl}/${id}`)
			.withCredentials()
			.set('Accept', 'application/json')
			.set('Access-Control-Allow-Origin', 'true')
			.set('Access-Control-Allow-Credentials', 'true').then(() => {
				logger.info(`GeonodeStore#delete Geonode Layer id: ${id} deleted.`);
				return this.reload(operationId);
			}).catch(error => {
				logger.error('GeonodeStore#update Error: ', error);
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

	addResponseListener(responseFunction) {
		this.responseListener.push(responseFunction);
	}
}

let storeInstance = new GeonodeStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	switch (action.type) {
		case CommonActionTypes.GEONODE_LAYER_CREATE_RESPOND:
			storeInstance.add(action.model.name || '', action.model.path, action.instanceId).then(geonodeLayer => {
				let geonodeLayerModel = new GeonodeLayerModel(null, geonodeLayer);
				storeInstance.emit(EventTypes.OBJECT_CREATED, geonodeLayerModel, action.responseData, action.stateHash, action.instanceId);
			});
			break;
		case ActionTypes.GEONODE_LAYER_UPDATE:
			storeInstance.update(action.data.id, action.data.name, action.data.path, action.data.operationId);
			break;
		case ActionTypes.GEONODE_LAYER_DELETE:
			storeInstance.delete(action.data.id, action.data.operationId);
			break;
		case ActionTypes.GEONODE_LAYER_LOAD:
			storeInstance.load(action.data.operationId);
	}
});

export default storeInstance;
