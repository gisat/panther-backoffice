//import React from 'react';
import EventEmitter from 'events';
import DataLayerModel from '../models/DataLayerModel';
import superagent from 'superagent';
import path from 'path';

import { publicPath } from '../config';

var CHANGE_EVENT = 'change';

class Store extends EventEmitter {

	/**
	 * To be overridden
	 */
	getApiUrl(){
		console.err("getApiUrl not overridden");
	}

	constructor() {
		super();
		//this._models = this.load(); //mozna ne tady ale primo do filtru atd. lazy load
	}

	emitChange() {
		this.emit(CHANGE_EVENT);
	}

	/**
	 * To be overridden
	 */
	load(){
		// todo ajax s parametrem
		var me = this;
		return new Promise(function (resolve, reject) {
			var url = path.resolve(publicPath, "api-proxy");
			console.log("super URL: ", url);
			superagent
				.post(url)
				.send({apiUrl: me.getApiUrl()})
				.send({ssid: "5oymzxv5yigf4n6dp2nda2vgu6ernils"})
				.send({sessionid: "kzgfcqe0a26jefi5c942hm7azef5od90"})
				.send({csrftoken: "VNsl5vgDXeEDRl3J4NgNt8BjBfmHgD9b"})
				//.send({necoDalsiho: "dmewidoiwjefowng"})
				.end(function(err, res){
					if(err || typeof res == 'undefined'){
						reject(err);
						return;
					}
					var ret = [];
					var responseJson = JSON.parse(res.text);
					if(typeof responseJson.data == 'undefined'){
						reject("no data attribute");
						return;
					}
					for(let obj of responseJson.data){
						ret.push(new DataLayerModel(obj));
					}
					resolve(ret);
				});
		});
	}

	addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback);
	}

	removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

	getFiltered(options){
		this._models = this.load();
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
		this._models = this.load();
		return this._models;
	}

	getById(id){
		return this.getFiltered({id: id});
	}
}

Store.dispatchToken = null;

export default Store;