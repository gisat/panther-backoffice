import _ from 'underscore';

import ApiStore from './ApiStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import DataLayerColumnsModel from '../models/DataLayerColumnsModel';
import logger from '../core/Logger';

class DataLayerColumnsStore extends ApiStore {

	load(){
		this._models = this._models || {};
		_.map(this._models, function(value, key){
			if(value == null){
				var method = this.getApiLoadMethod();
				var formData = {layer: key};
				this._models[key] = this.request(method, formData);
			}
		}, this);
		return this._models;
	}

	getByDataSource(dataLayerName){
		if(!dataLayerName) return [];
		this._models[dataLayerName] = this._models[dataLayerName] || null;
		this.load();
		return this._models[dataLayerName];
	}

	getFiltered(){
		logger.error("DataLayerColumnsStore# getFiltered(), Don't use getFiltered on DataLayerColumnStore");
	}
	getAll(){
		logger.error("DataLayerColumnsStore# getAll(), Don't use getAll on DataLayerColumnStore");
	}
	getById(){
		logger.error("DataLayerColumnsStore# getById(), Don't use getById on DataLayerColumnStore");
	}


	getApiUrl(){
		return "/api/layers/getLayerDetails";
	}
	getApiLoadMethod(){
		return "POST";
	}
	getInstance(options,data){
		return new DataLayerColumnsModel(options,data);
	}
}

let storeInstance = new DataLayerColumnsStore();
export default storeInstance;
