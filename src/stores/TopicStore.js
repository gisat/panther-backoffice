import ApiStore from './ApiStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import TopicModel from '../models/TopicModel';

//import UserStore from './UserStore';
import logger from '../core/Logger';

class TopicStore extends ApiStore {

	getApiUrl(){
		return "/rest/topic";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
	}

	getInstance(options,data){
		return new TopicModel(options,data);
	}
}

let storeInstance = new TopicStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	logger.trace("TopicStore# received(), Action: ", action);

	switch(action.type) {
		case ActionTypes.TOPIC_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.TOPIC_HANDLE:
			storeInstance.handle(action.data, action.operationId);
			break;
		default:
			return;
	}

});

export default storeInstance;
