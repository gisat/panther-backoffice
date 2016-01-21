//import React from 'react';
import EventEmitter from 'events';

var CHANGE_EVENT = 'change';

class Store extends EventEmitter {

	constructor() {
		super();
		this._models = this.load(); //mozna ne tady ale primo do filtru atd. lazy load
	}

	emitChange() {
		this.emit(CHANGE_EVENT);
	}

	/**
	 * To be overridden
	 */
	load(){
		console.error("Store.load not overridden");
	}

	addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback);
	}

	removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

	// todo filter
	filter(options){
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

	// todo all
	all(){
		return this._models;
	}

	// todo byId
	byId(id){
		return this.filter({id: id});
	}
}

Store.dispatchToken = null;

export default Store;
