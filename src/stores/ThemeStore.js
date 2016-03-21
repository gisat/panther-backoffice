import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import ThemeModel from '../models/ThemeModel';

class ThemeStore extends Store {

	getApiUrl(){
		return "/rest/theme";
	}

	getInstance(options,data){
		return new ThemeModel(options,data);
	}
}

let storeInstance = new ThemeStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.THEME_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.THEME_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

});

export default storeInstance;
