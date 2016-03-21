import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import TopicModel from '../models/TopicModel';

class TopicStore extends Store {

	getApiUrl(){
		return "/rest/topic";
	}

	getInstance(options,data){
		return new TopicModel(options,data);
	}
}

let storeInstance = new TopicStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.TOPIC_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.TOPIC_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

});

export default storeInstance;
