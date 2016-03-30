import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import AnalysisRunModel from '../models/AnalysisRunModel';


class AnalysisRunStore extends Store {

	getApiUrl(){
		return "/rest/performedanalysis";
	}
	getInstance(options,data){
		return new AnalysisRunModel(options,data);
	}

}

let storeInstance = new AnalysisRunStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.ANALYSIS_RUN_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.ANALYSIS_RUN_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

});

export default storeInstance;
