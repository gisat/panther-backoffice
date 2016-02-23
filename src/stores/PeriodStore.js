import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import PeriodModel from '../models/PeriodModel';


class PeriodStore extends Store {

	getApiUrl(){
		return "/rest/year";
	}
	getInstance(options,data){
		return new PeriodModel(options,data);
	}

}

let storeInstance = new PeriodStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

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

	//storeInstance.emitChange();

});

export default storeInstance;
