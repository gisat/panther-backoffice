//import React from 'react';
import EventEmitter from 'events';
import DataLayerModel from '../models/DataLayerModel';
import request from 'superagent';
import path from 'path';

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
		var url = path.resolve("/tool", this.getApiUrl());
		request
			.get(url)
			.end(function(err, res){
				console.log("Superagent result: ", res);
			});

		var fakeLayers = require('./tempDataLayersJinej.js');
		var ret = [];
		for(let obj of fakeLayers.data){
			ret.push(new DataLayerModel(obj));
		}
		return Promise.resolve(ret);
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
