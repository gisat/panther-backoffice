import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {ActionTypes} from '../constants/AppConstants';

//let appState;

//function reset() {
//	//appState = {};
//}


class PeriodStore extends Store {

	constructor() {
		super();
	}

	getState() {
		//return appState;
	}

}

let periodStoreInstance = new PeriodStore();

periodStoreInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		//case ActionTypes.APP_INITIALIZED:
		//	reset();
		//	break;
		case ActionTypes.LAYER_ADD: //todo
			appState.page = action.page;
			appState.path = action.path;
			break;

		// case ActionTypes.APP_RESET:
		//   reset();
		//   break;

		// case ActionTypes.POUCH_ERROR:
		//   appState.message = 'Local database error: ' + action.error.message;
		//   break;

		default:
			return;
	}

	appStoreInstance.emitChange();

});

export default periodStoreInstance;
