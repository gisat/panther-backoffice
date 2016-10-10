//import React from 'react';
import Store from './Store';
import superagent from 'superagent';
import path from 'path';
import _ from 'underscore';
import async from 'async';

import ListenerHandler from '../core/ListenerHandler';

import DataLayerModel from '../models/DataLayerModel';
import EventTypes from '../constants/EventTypes';

import { apiProtocol, apiHost, apiPath } from '../config';
import logger from '../core/Logger';
import utils from '../utils/utils';

class ApiStore extends Store {

	constructor() {
		super();
		this._models = this.load(); //mozna ne tady ale primo do filtru atd. lazy load
		//Promise.resolve(this._models).then(function(models){
		//	console.log("Store > constructor > _models",models);
		//});
		this.changeListener = new ListenerHandler(this, this.reload, 'addChangeListener', 'removeChangeListener');
		this.registerListeners();
		this._maxListeners = 40; // increase listener limit a bit, but todo fix removeListeners
	}

	/**
	 * To be overridden
	 */
	getApiUrl(){
		logger.error(this.constructor.name + ":ApiStore# getApiUrl(), getApiUrl not overridden");
	}

	getCreateApiUrl() {
		return this.getApiUrl();
	}

	getApiLoadMethod(){
		return "GET";
	}

	registerListeners(){}

	getInstance(options,data){
		logger.error(this.constructor.name + ":ApiStore# getInstance(options, data), getInstance not overridden", options, data);
		return {};
	}



	addResponseListener(callback) {
		this.on(EventTypes.OBJECT_CREATED, callback);
		//this.on(EventTypes.OBJECT_CREATE_FAILED, callback); //etc
	}

	removeResponseListener(callback) {
		this.removeListener(EventTypes.OBJECT_CREATED, callback);
	}

	reloadInternal() {
		logger.trace(this.constructor.name + ":ApiStore# reload(), In progress: ", this.reloadInProgress);
		if(this.reloadInProgress) {
			return;
		}
		this.reloadInProgress = true;
		var guid = utils.guid();
		logger.trace(this.constructor.name + ":ApiStore# reload(), GUID: ", guid);
		var thisStore = this;
		this._models = this.load();
		this._models.then(function(){
			logger.trace(thisStore.constructor.name + ":ApiStore# reload(), Models loading finished, GUID: ", guid);
			thisStore.reloadInProgress = false;
		});
		return this._models;
	}

	reload() {
		var thisStore = this;
		let res = this.reloadInternal();
		if (res) {
			res.then(function(){
				thisStore.emitChange();
			});
			return res;
		}
	}

	load() {
		var method = this.getApiLoadMethod();
		return this.request(method);
	}

	create(model) {
		var object = model.serialize();
		var method = "POST";
		return this.request(method, {data: object}, this.getCreateApiUrl());
	}

	update(model) {
		var object = model.serialize();
		var method = "PUT";
		return this.request(method, {data: object});
	}

	delete(model) {
		var object = model.serialize();
		var method = "DELETE";
		return this.request(method, {data: object});
	}

	/**
	 * Handle requests asynchronously or in synchronous batches. When all is resolved, reloads the store.
	 * @param actionData Array of arrays (of synchronous batches of requests) or array of requests
	 * @param operationId Operation ID to send in case of error
	 */
	handle(actionData, operationId) {
		var thisStore = this;

		// if not arrray of arrays (batches of commands)
		if(!Array.isArray(actionData[0])){
			actionData = [actionData];
		}

		async.eachSeries(

			// this is the array to be iterated
			actionData,

			// this is the iterator
			// it works synchronous in async.eachSeries - it's waiting for each cycle to be finished
			function(batch, callback){
				logger.trace(this.constructor.name + ":ApiStore# handle(), Batch", batch);
				var promises = [];
				batch.forEach(function(action){
					switch (action.type) {
						case "create":
							promises.push(this.create(action.model));
							break;
						case "update":
							promises.push(this.update(action.model));
							break;
						case "delete":
							promises.push(this.delete(action.model));
							break;
					}
				}, this);
				Promise.all(promises).then(function(){
					logger.trace(thisStore.constructor.name + ":ApiStore# handle(), Batch finished");
					callback(); // this is how one cycle says it's finished
				}, function(err){
					callback(err);
				});
			}.bind(this),

			// this is the final callback of async.eachSeries
			function(err){
				logger.trace(this.constructor.name + ":ApiStore# handle(), Final callback", err);
				if(err){
					this.emitError(err, operationId);
					return logger.error(this.constructor.name + ":ApiStore# handle(), Error: ", err);
				}
				this.reload();
			}.bind(this)
		);

	}

	createObjectAndRespond(model,responseData,responseStateHash, instanceId) {
		let guid = utils.guid();
		logger.trace(this.constructor.name + ":ApiStore# createObjectAndRespond(), Response data",responseData, ", GUID: ", guid, ", instance",instanceId);
		// todo ? Model.resolveForServer ?
		//var object = {
		//	name: objectData.name,
		//	active: false
		//};
		var thisStore = this;
		var resultPromise = this.create(model);

		resultPromise.then(function(result){
			logger.trace(thisStore.constructor.name + ":ApiStore# createObjectAndRespond(), Promise resolved - Result", result, ", GUID: ", guid);
			thisStore.reload().then(function(){
				logger.trace(thisStore.constructor.name + ":ApiStore# createObjectAndRespond(), Reload finished", result, ", GUID: ", guid);
				//thisStore.emitChange(); // emitChange is in reload(), todo delete here
				thisStore.emit(EventTypes.OBJECT_CREATED,result,responseData,responseStateHash, instanceId);
			});
		});
	}

	request(method, object, apiUrl){
		object = object || {};

		//shouldReturnData parameter removed. Respectively never commited.
		//It just returns data if there are some.

		var thisStore = this;
		return new Promise(function (resolve, reject) {
			apiUrl = apiUrl || thisStore.getApiUrl();
			var url = apiProtocol + apiHost + path.join(apiPath, apiUrl).replace(/\\/g, "/");
			var communicationObject = superagent(method.toUpperCase(), url);
			communicationObject._callback = function(){
				logger.info(thisStore.constructor.name + ":ApiStore# request(), Argument: ",arguments[0]);
			};
				communicationObject.send(object)
				.withCredentials()
				.set('Accept', 'application/json')
				.set('Access-Control-Allow-Origin', 'true')
				.set('Access-Control-Allow-Credentials', 'true')
				.end(function(err, res){

					// No response
					if(typeof res == 'undefined'){
						let errorMessage = err ? "Server request failed\nError message: " + err : "Error: Empty response";
						logger.error(thisStore.constructor.name + ":ApiStore#request " + errorMessage);
						utils.displayMessage(errorMessage);
						reject(err);
						return;
					}

					// Response present, but with empty text
					if(!res.text) {
						logger.warn(thisStore.constructor.name + ":ApiStore#request No data was returned.");
						resolve();
						return;
					}

					// Parse response.text JSON
					try {
						var responseJson = JSON.parse(res.text);
					}catch(e){
						let errorMessage = "Error: Failed to parse server response.";
						logger.error(thisStore.constructor.name + ":ApiStore#request JSON parse: " + errorMessage);
						utils.displayMessage(errorMessage);
						reject(e);
						return;
					}

					// ajax request returned as error
					if(err){
						let responseMessage = "";
						if(responseJson.hasOwnProperty('message')){
							responseMessage = responseJson.message;
						}
						utils.displayMessage(err + "\n" + responseMessage);
						reject(err);
						return;
					}

					// if there is no data attribute in the response
					if (!responseJson.hasOwnProperty('data')) {
						return resolve();
					}

					// if only one record in the response
					if (responseJson.data.hasOwnProperty("_id")) {
						responseJson.data = [responseJson.data];
					}

					// instantiate objects with models
					if(typeof responseJson.data == "string") {

						let instance = thisStore.getInstance(null, responseJson.data);
						resolve(instance);

					} else {

						var ret = [], promises = [];
						for (let obj of responseJson.data) {
							let instance = thisStore.getInstance(null, obj);
							if (instance) {
								ret.push(instance);
								promises.push(instance.ready);
							}
						}
						Promise.all(promises).then(function(){
							_.each(ret, function(instance){
								delete instance.ready;
							}, this);
							resolve(ret);
						});

					}
				});
			///////////////////////////////////

		});
	}

	getFiltered(options){
		//this._models = this.load();
		var self = this;
		return new Promise(function (resolve, reject) {
			self._models.then(function (models) {
				var filtered = models.filter(function (model) {
					var shouldRemain = true;

					// If it doesn't satisfy all the conditions. Array means that the attribute under the key must be
					// contained in the value to succeed.
					_.each(options, function (value, key) {
						if(_.isArray(value)) {
							if(_.isEmpty(value)) {
								shouldRemain = false;
								return;
							}
							if(!_.contains(value, model[key])) {
								shouldRemain = false;
							}
						} else {
							if (!model.hasOwnProperty(key) || model[key] != value) {
								shouldRemain = false;
							}
						}
					});

					return shouldRemain;
				});

				resolve(filtered);
			}, function (err) {
				reject(err);
			})
		});
	}

	getAll(){
		//this._models = this.load();
		return this._models;
	}

	getById(id){
		var resultPromise = this.getFiltered({key: id});
		return new Promise(function (resolve, reject) {
			resultPromise.then(function(result){
				if(result.length){
					resolve(result[0]);
				} else {
					resolve(null);
				}
			}, function (err) {
				reject(err);
			});
		});
	}

	/**
	 * For transforming (for local) array of keys to array of models while preserving order
	 * todo edit getFiltered to preserve order and get rid of this func?
	 * @param keyArray
	 * @returns {Promise}
	 */
	getByKeyArray(keyArray) {
		let promises = [];
		for (let index in keyArray) {
			promises[index] = (this.getById(keyArray[index]));
		}
		return Promise.all(promises);
	}

}

export default ApiStore;
