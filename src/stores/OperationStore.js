import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import logger from '../core/Logger';
import utils from '../utils/utils';

class OperationStore extends EventEmitter {

	constructor(){
		super();
		this._operations = {};
	};

	emitChange() {
		logger.trace("OperationStore# emitChange()");
		this.emit(EventTypes.STORE_CHANGE);
	}

	addChangeListener(callback) {
		console.info("OperationStore#addChangeListener", callback);
		this.on(EventTypes.STORE_CHANGE, callback);
	}

	removeChangeListener(callback) {
		this.removeListener(EventTypes.STORE_CHANGE, callback);
	}

	getAll(){
		return utils.clone(this._operations);
	}

	add(id, operation){
		logger.info("OperationStore#add. " + id);
		this._operations[id] = operation;
		this.emitChange();
	}

	remove(id){
		logger.info("OperationStore#remove. " + id);
		delete this._operations[id];
		this.emitChange();
	}


}

let storeInstance = new OperationStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	logger.trace("OperationStore# received(), Action: ", action);

	switch(action.type) {
		case ActionTypes.ADD_OPERATION:
			storeInstance.add(action.id, action.operation);
			break;
		case ActionTypes.REMOVE_OPERATION:
			storeInstance.remove(action.id);
			break;
		default:
			return;
	}

});

export default storeInstance;
