import ApiStore from './ApiStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import ScopeModel from '../models/ScopeModel';

//import UserStore from './UserStore';
import AULevelStore from './AULevelStore';
import PeriodStore from './PeriodStore';
import logger from '../core/Logger';


class ScopeStore extends ApiStore {

	getApiUrl(){
		return "/rest/dataset";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
		this.changeListener.add(AULevelStore);
		this.changeListener.add(PeriodStore);
	}

	getInstance(options,data){
		return new ScopeModel(options,data);
	}
}

let storeInstance = new ScopeStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	logger.trace("ScopeStore# received(), Action: ", action);

	switch(action.type) {
		case ActionTypes.SCOPE_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash, action.instanceId);
			break;
		case ActionTypes.SCOPE_HANDLE:
			storeInstance.handle(action.data, action.operationId);
			break;
		default:
			return;
	}

});

export default storeInstance;
