//import React from 'react';
import EventEmitter from 'events';
import superagent from 'superagent';
import path from 'path';
import _ from 'underscore';
import async from 'async';

import DataLayerModel from '../models/DataLayerModel';
import EventTypes from '../constants/EventTypes';

import { publicPath, apiProtocol, apiHost, apiPath, tempSsid, tempSessionid, tempCsrftoken } from '../config';


class Store extends EventEmitter {

	constructor() {
		super();
		this._models = this.load(); //mozna ne tady ale primo do filtru atd. lazy load
		//Promise.resolve(this._models).then(function(models){
		//	console.log("Store > constructor > _models",models);
		//});
		this._maxListeners = 20; // increase listener limit a bit, but todo fix removeListeners
	}

	/**
	 * To be overridden
	 */
	getApiUrl(){
		console.error("getApiUrl not overridden");
	}

	getApiLoadMethod(){
		return "GET";
	}

	getInstance(options,data){
		console.error("getInstance not overridden");
		return {};
	}


	emitChange() {
		this.emit(EventTypes.STORE_CHANGE);
	}

	addChangeListener(callback) {
		this.on(EventTypes.STORE_CHANGE, callback);
	}

	removeChangeListener(callback) {
		this.removeListener(EventTypes.STORE_CHANGE, callback);
	}

	addResponseListener(callback) {
		this.on(EventTypes.OBJECT_CREATED, callback);
		//this.on(EventTypes.OBJECT_CREATE_FAILED, callback); //etc
	}

	removeResponseListener(callback) {
		this.removeListener(EventTypes.OBJECT_CREATED, callback);
	}

	reload() {
		var thisStore = this;
		this._models = this.load();
		this._models.then(function(){
			thisStore.emitChange();
		});
		return this._models;
	}


	load() {
		var method = this.getApiLoadMethod();
		return this.request(method);
	}

	create(model) {
		var object = model.serialize();
		var method = "POST";
		return this.request(method, {data: object});
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
	 */
	handle(actionData) {

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
				console.log("BATCH", batch); // todo remove log
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
					console.log("BATCH FINISHED"); // todo remove log
					callback(); // this is how one cycle says it's finished
				});
			}.bind(this),

			// this is the final callback of async.eachSeries
			function(err){
				console.log("FINAL CALLBACK", err); // todo remove log
				if(err){
					return console.error(err);
				}
				this.reload();
			}.bind(this)
		);

	}

	createObjectAndRespond(model,responseData,responseStateHash) {
		//console.log("PeriodStore createObject responseData",responseData);
		// todo ? Model.resolveForServer ?
		//var object = {
		//	name: objectData.name,
		//	active: false
		//};
		var thisStore = this;
		var resultPromise = this.create(model);

		resultPromise.then(function(result){
			thisStore.reload().then(function(){
				thisStore.emitChange();
				thisStore.emit(EventTypes.OBJECT_CREATED,result,responseData,responseStateHash);
			});
		});
	}

	request(method, object){
		object = object || {};

		//shouldReturnData parameter removed. Respectively never commited.
		//It just returns data if there are some.

		var thisStore = this;
		return new Promise(function (resolve, reject) {

			var url = apiProtocol + apiHost + path.join(apiPath, thisStore.getApiUrl()).replace(/\\/g, "/");
			superagent(method.toUpperCase(), url)
				.send(object)
				.query({justMine: true})
				.withCredentials()
				.set('Access-Control-Allow-Origin', 'true')
				.set('Accept', 'application/json')
				.set('Access-Control-Allow-Credentials', 'true')
				.end(function(err, res){
					if(err || typeof res == 'undefined'){
						reject(err);
						return;
					}

					var responseJson = JSON.parse(res.text);

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

Store.dispatchToken = null;

export default Store;
