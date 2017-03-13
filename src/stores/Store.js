//import React from 'react';
import EventEmitter from 'events';
import ListenerHandler from '../core/ListenerHandler';
import EventTypes from '../constants/EventTypes';

import logger from '../core/Logger';
import utils from '../utils/utils';

class Store extends EventEmitter {


	emit(event, ...args) {
		logger.trace(this.constructor.name + " EMIT " + event, args);
		super.emit(event, ...args);
	}

	addEventListener(event, callback) {
		this.on(event, callback);
	}

	removeEventListener(event, callback) {
		this.removeListener(event, callback);
	}

	emitChange() {
		logger.trace(this.constructor.name + ":Store# emitChange()");
		this.emit(EventTypes.STORE_CHANGE);
	}

	addChangeListener(callback) {
		this.on(EventTypes.STORE_CHANGE, callback);
	}

	removeChangeListener(callback) {
		this.removeListener(EventTypes.STORE_CHANGE, callback);
	}

	emitError(error, operationId, data) {
		logger.trace(this.constructor.name + ":Store# emitError()");
		this.emit(EventTypes.STORE_ERROR, error, operationId, data);
	}

	addErrorListener(callback) {
		this.on(EventTypes.STORE_ERROR, callback);
	}

	removeErrorListener(callback) {
		this.removeListener(EventTypes.STORE_ERROR, callback);
	}


	getFiltered(options){
		return Promise.resolve(null);
	}

	getAll(){
		return Promise.resolve(null);
	}

	getById(id){
		return Promise.resolve(null);
	}

}

Store.dispatchToken = null;

export default Store;
