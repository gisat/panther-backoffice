//import React from 'react';
import EventEmitter from 'events';
import ListenerHandler from '../core/ListenerHandler';
import EventTypes from '../constants/EventTypes';

import logger from '../core/Logger';
import utils from '../utils/utils';

class Store extends EventEmitter {


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
