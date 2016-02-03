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
		//this._models.then(function(models){
		//	console.log("Store > constructor > _models",models);
		//});
	}

	/**
	 * To be overridden
	 */
	getApiUrl(){
		console.err("getApiUrl not overridden");
	}

	getApiLoadMethod(){
		return "GET";
	}

	getInstance(obj){
		//console.err("getInstance not overridden");
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


	///**
	// * To be overridden
	// */
	//load(){
	//	var me = this;
	//	return new Promise(function (resolve, reject) {
	//		var url = path.resolve(publicPath, "api-proxy");
	//		superagent
	//			.post(url)
	//			.send({apiUrl: me.getApiUrl()})
	//			.send({method: me.getApiLoadMethod()})
	//			.send({ssid: "5oymzxv5yigf4n6dp2nda2vgu6ernils"})
	//			.send({sessionid: "kzgfcqe0a26jefi5c942hm7azef5od90"})
	//			.send({csrftoken: "VNsl5vgDXeEDRl3J4NgNt8BjBfmHgD9b"})
	//			//.send({necoDalsiho: "dmewidoiwjefowng"})
	//			.end(function(err, res){
	//				if(err || typeof res == 'undefined'){
	//					reject(err);
	//					return;
	//				}
	//				var ret = [];
	//				var responseJson = JSON.parse(res.text);
	//				if(typeof responseJson.data == 'undefined'){
	//					reject("no data attribute");
	//					return;
	//				}
	//				for(let obj of responseJson.data){
	//					let instance = me.getInstance(obj);
	//					if(instance){
	//						ret.push(instance);
	//					}
	//					//ret.push(new DataLayerModel(obj));
	//				}
	//				resolve(ret);
	//			});
	//	});
	//}
	load() {
		var method = this.getApiLoadMethod();
		return this.request(method);
	}

	create(object) {
		var method = "POST";
		return this.request(method, object);
	}

	update(object) {
		var method = "PUT";
		return this.request(method, object);
	}

	delete(object) {
		var method = "DELETE";
		return this.request(method, object);
	}

	handle(actionData) {
		var promises = [];
		var thisStore = this;
		actionData.forEach(function(action){
			switch (action.type) {
				case "create":
					promises.push(thisStore.create(action.object));
					break;
				case "update":
					promises.push(thisStore.update(action.object));
					break;
				case "delete":
					promises.push(thisStore.delete(action.object));
					break;
			}
		});
		Promise.all(promises).then(function(){
			thisStore.reload().then(function(){
				thisStore.emitChange();
			});
		});
	}

	request(method, object){
		object = object || {};

		//shouldReturnData parameter removed. Respectively never commited.
		//It just returns data if there are some.

		var me = this;
		return new Promise(function (resolve, reject) {


			// todo: Request API directly. Need to solve CORS credentials problem
			//var url = apiProtocol + apiHost + path.join(apiPath, me.getApiUrl()).replace(/\\/g, "/");
			//var method = "GET";
			//
			//superagent(method.toUpperCase(), url)
			//	.send({data: object})
			//	.withCredentials()
			//	.set('Access-Control-Allow-Origin', 'true')
			//	.set('Accept', 'application/json')
			//	.set('Access-Control-Allow-Credentials', 'true')
			//	.end(function(err, res){
			//
			//		if(res.req.url == "http://37.205.9.78/tool/api/layers/getLayers") {
			//			console.log("RES1: ", res);
			//			console.log("RES1 REQ METHOD: " + res.req.method);
			//		}
			//
			//
			//		if(err || typeof res == 'undefined'){
			//			reject(err);
			//			return;
			//		}
			//		var ret = [];
			//		var responseJson = JSON.parse(res.text);
			//		//console.log("Response JSON: ", responseJson, "%%%%%%%%%%%%%%%%%%%%%%%%%%");
			//		if(typeof responseJson.data == 'undefined'){
			//			if(res.req.url == "http://37.205.9.78/tool/api/layers/getLayers")
			//				console.log("((((((((((((((((( LAYERS no data )))))))))))))))))");
			//			//reject("no data attribute");
			//			return;
			//		}else{
			//			if(res.req.url == "http://37.205.9.78/tool/api/layers/getLayers")
			//				console.log("<<<<<<<<<<<<<<<<<< LAYERS OK >>>>>>>>>>>>>>>>>>>>>");
			//		}
			//		if(responseJson.data.hasOwnProperty("_id")) {
			//			responseJson.data = [responseJson.data];
			//		}
			//		for(let obj of responseJson.data){
			//			let instance = me.getInstance(obj);
			//			if(instance){
			//				ret.push(instance);
			//			}
			//			//ret.push(new DataLayerModel(obj));
			//		}
			//		if(res.req.url == "http://37.205.9.78/tool/api/layers/getLayers")
			//			console.log("RETURNING: ", ret);
			//		resolve(ret);
			//	});
			///////////////////////////////////



			// todo Temporary use of API proxy
			var url = path.resolve(publicPath, "api-proxy")
					// append METHOD and last API directory, just for better debugging
					+ "?" + method.toUpperCase() + "-" + me.getApiUrl().split("/").pop();
			superagent
			.post(url)
			.send({apiUrl: me.getApiUrl()})
			.send({method: method})
			.send({ssid: "3ja43byvd8uafb11uglakyuclpgscig6"})
			.send({sessionid: "hflfhdxabpcjjryd7vu0mqr6ms0arm6t"})
			.send({csrftoken: "VNsl5vgDXeEDRl3J4NgNt8BjBfmHgD9b"})
			.send({data: object})
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
				var ret = [];
				for (let obj of responseJson.data) {
					let instance = me.getInstance(obj);
					if (instance) {
						ret.push(instance);
					}
				}
				resolve(ret);
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
		return this.getFiltered({key: id});
	}
}

Store.dispatchToken = null;

export default Store;
