//import React from 'react';
import EventEmitter from 'events';
import superagent from 'superagent';
import path from 'path';
import DataLayerModel from '../models/DataLayerModel';
import EventTypes from '../constants/EventTypes';

import _ from 'underscore';

import { publicPath, apiProtocol, apiHost, apiPath } from '../config';


class Store extends EventEmitter {

	constructor() {
		super();
		this._models = this.load(); //mozna ne tady ale primo do filtru atd. lazy load
		//Promise.resolve(this._models).then(function(models){
		//	console.log("Store > constructor > _models",models);
		//});
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

	handle(actionData) {
		var promises = [];
		var thisStore = this;
		actionData.forEach(function(action){
			switch (action.type) {
				case "create":
					promises.push(thisStore.create(action.model));
					break;
				case "update":
					promises.push(thisStore.update(action.model));
					break;
				case "delete":
					promises.push(thisStore.delete(action.model));
					break;
			}
		});
		Promise.all(promises).then(function(){
			thisStore.reload();
		});
	}

	request(method, object){
		object = object || {};

		//shouldReturnData parameter removed. Respectively never commited.
		//It just returns data if there are some.

		var thisStore = this;
		return new Promise(function (resolve, reject) {


			// todo: Request API directly. Need to solve CORS credentials problem
			/*var url = apiProtocol + apiHost + path.join(apiPath, me.getApiUrl()).replace(/\\/g, "/");
			var method = "GET";

			superagent(method.toUpperCase(), url)
				.send({data: object})
				.withCredentials()
				.set('Access-Control-Allow-Origin', 'true')
				.set('Accept', 'application/json')
				.set('Access-Control-Allow-Credentials', 'true')
				.end(function(err, res){

					if(res.req.url == "http://37.205.9.78/tool/api/layers/getLayers") {
						console.log("RES1: ", res);
						console.log("RES1 REQ METHOD: " + res.req.method);
					}


					if(err || typeof res == 'undefined'){
						reject(err);
						return;
					}
					var ret = [];
					var responseJson = JSON.parse(res.text);
					//console.log("Response JSON: ", responseJson, "%%%%%%%%%%%%%%%%%%%%%%%%%%");
					if(typeof responseJson.data == 'undefined'){
						if(res.req.url == "http://37.205.9.78/tool/api/layers/getLayers")
							console.log("((((((((((((((((( LAYERS no data )))))))))))))))))");
						//reject("no data attribute");
						return;
					}else{
						if(res.req.url == "http://37.205.9.78/tool/api/layers/getLayers")
							console.log("<<<<<<<<<<<<<<<<<< LAYERS OK >>>>>>>>>>>>>>>>>>>>>");
					}
					if(responseJson.data.hasOwnProperty("_id")) {
						responseJson.data = [responseJson.data];
					}
					for(let obj of responseJson.data){
						let instance = me.getInstance(null,obj);
						if(instance){
							ret.push(instance);
						}
						//ret.push(new DataLayerModel(obj));
					}
					if(res.req.url == "http://37.205.9.78/tool/api/layers/getLayers")
						console.log("RETURNING: ", ret);
					resolve(ret);
				});
			/////////////////////////////////// */


			// todo Temporary use of API proxy
			var url = path.resolve(publicPath, "api-proxy")
					// append METHOD and last API directory, just for better debugging
					+ "?" + method.toUpperCase() + "-" + thisStore.getApiUrl().split("/").pop();
			superagent
			.post(url)
			.send({apiUrl: thisStore.getApiUrl()})
			.send({method: method})
			.send({ssid: "usuhtto69t2xhyg32v6ffwc5psboyn2h"})
			.send({sessionid: "3nbg1bhc6ticj1kkkwyx1j5kg4njiz50"})
			.send({csrftoken: "FNtZT1UL4EpxiJn6BlM2cLeXzMrta4zp"})
			.send({formData: object})
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
						resolve(ret);
					});

				}
			});



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
								return;
							}
							if(!_.contains(value, model[key])) {
								shouldRemain = false;
							}
						} else {
							if (!model[key] || model[key] != value) {
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

}

Store.dispatchToken = null;

export default Store;
