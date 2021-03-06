import ApiStore from './ApiStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import StyleModel from '../models/StyleModel';

//import UserStore from './UserStore';
import TopicStore from './TopicStore';
import logger from '../core/Logger';

class StyleStore extends ApiStore {

	getApiUrl(){
		return "/rest/symbology";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
		this.changeListener.add(TopicStore);
	}

	getInstance(options,data){
		return new StyleModel(options,data);
	}
}

let storeInstance = new StyleStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.STYLE_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash, action.instanceId);
			break;
		case ActionTypes.STYLE_HANDLE:
			storeInstance.handle(action.data, action.operationId);
			break;
		default:
			return;
	}

});

export default storeInstance;
