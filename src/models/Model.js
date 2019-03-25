import _ from 'underscore';
import logger from '../core/Logger';
import config from '../config';

class Model {
	/**
	 * returns promise of this model.
	 */
	constructor(options,data) {
		if (config.models) {
			this._modelConfig = _.assign({}, config.models.common, config.models[this.getType()]);
		}
		if(data){
			var self = this;
			var resolvePromise = this.resolveForLocal(data); // todo do we ever need both options and data?
			this.ready = new Promise(function(resolve,reject){
				resolvePromise.then(function(opts){
					_.assign(self,opts);
					delete self._modelConfig;
					resolve();
				});
			});
		} else {
			_.assign(this,this.prepareModel(options));
			delete this._modelConfig;
			this.ready = Promise.resolve();
		}
	}

	/**
	 * Prepare promise for all the properties, which are actual domain objects.
	 * @param data Object with data from the API.
	 * @param model Optional - model for resolving nested objects
	 * @param self Optional - this (for nested)
	 */
	resolveForLocal(data, model, self) {
		//var self = this;
		var ret = {};
		var promises = [];
		if(!self){
			self = this;
		}
		if(!model) {
			model = self.data();
			if (config.models && self._modelConfig) {
				// only allow first level keys allowed in config
				//todo this doesn't work (omit returns, not mutates), but who knows what a fix will do
				//_.omit(model,function(keyProps, key) {
				//	return !self._modelConfig[key];
				//});
			}
		}
		_.each(model, function (keyProps, key) {
			if (keyProps.isArrayOfNested) {
				if(data[keyProps.serverName]) {
					let nestedPromises = [];
					for (var nested of data[keyProps.serverName]) {
						let nestedPromise = self.resolveForLocal(nested, model[key].model, self);
						nestedPromises.push(nestedPromise);
					}
					Promise.all(nestedPromises).then(function(arrayOfNested){
						ret[key] = arrayOfNested;
					}).catch(error => {
						logger.error(`Model# resolveForLocal() Failed to resolve nested promises. Error: ${error} | data:`, data);
					});
					promises.push(Promise.all(nestedPromises));
				} else {
					ret[key] = [];
				}
			}	else {
				if (keyProps.isPromise) {
					let promise = keyProps.transformForLocal(data[keyProps.serverName], data);
					promise.then(function(transformedData){
						ret[key] = transformedData;
					}).catch(error => {
						logger.error(`Model# resolveForLocal() Failed to resolve data. Error: ${error} | data:`, data, '| key: ', key, '| keyProps:', keyProps);
					});
					promises.push(promise);
				} else if (!keyProps.ignoreEmpty || !!data[keyProps.serverName]) {
					if (keyProps.transformForLocal) {
						ret[key] = keyProps.transformForLocal(data[keyProps.serverName], data);
					} else {
						ret[key] = data[keyProps.serverName];
					}
				}
			}

		});

		return new Promise(function (resolve, reject) {
			Promise.all(promises).then(function(){
				resolve(ret);
			});
		});
	}

	/**
	 * Called on options when creating model locally. To be overriden.
	 * @param options
	 * @returns {*}
	 */
	prepareModel(options) {
		return options;
	}

	/**
	 * get asociated object type from constants/ObjectTypes
	 */
	getType() {
		return 'common';
	}

	/**
	 * Transform self for server
	 */
	serialize() {
		return this.serializeModel(this,this.data());
	}

	/**
	 * Transform model for server
	 */
	serializeModel(object, model) {
		var self = this;
		var serializedObject = {};
		_.each(object, function (value, key) {
			if(key!=="ready" && model[key].sendToServer) {
				if(model[key].hasOwnProperty("isArrayOfNested") && model[key].isArrayOfNested) {
					for (var i in value) {
						value[i] = self.serializeModel(value[i], model[key].model);
					}
				} else if (model[key].hasOwnProperty("isNested") && model[key].isNested) {
					value = self.serializeModel(value, model[key].model);
				} else if (model[key].hasOwnProperty("transformForServer")){
					value = model[key].transformForServer(value, object);
				}
				key = model[key].serverName;
				serializedObject[key] = value;
			}
		});
		logger.trace("Model# serializeModel(), Serialized object:",serializedObject);
		return serializedObject;
	}

	// todo static?
	transformDate(dateString) {
		if (dateString) return new Date(dateString);
		return null;
	}

	getKey(model) {
		return (model) ? model.key : null;
	}

	getKeys(models) {
		let keys = [];
		for (let model of models) {
			keys.push(model.key);
		}
		return keys;
	}

}

export default Model;
