import ApiStore from './ApiStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import PeriodModel from '../models/PeriodModel';

//import UserStore from './UserStore';
import logger from '../core/Logger';

class PeriodStore extends ApiStore {

	getApiUrl(){
		return "/rest/year";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
	}

	getInstance(options,data){
		return new PeriodModel(options,data);
	}

}

let storeInstance = new PeriodStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	logger.trace("PeriodStore# received(), Action: ", action);

	switch(action.type) {
		case ActionTypes.PERIOD_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.PERIOD_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

});

export default storeInstance;
