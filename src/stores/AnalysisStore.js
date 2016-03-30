import Store from './Store';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import AnalysisModel from '../models/AnalysisModel';


class AnalysisStore extends Store {

	getApiUrl(){
		return "/rest/analysis";
	}
	getInstance(options,data){
		return new AnalysisModel(options,data);
	}

}

let storeInstance = new AnalysisStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {

	switch(action.type) {
		case ActionTypes.ANALYSIS_SPATIAL_CREATE_RESPOND:
		case ActionTypes.ANALYSIS_LEVEL_CREATE_RESPOND:
		case ActionTypes.ANALYSIS_MATH_CREATE_RESPOND:
			storeInstance.createObjectAndRespond(action.model, action.responseData, action.stateHash);
			break;
		case ActionTypes.ANALYSIS_SPATIAL_HANDLE:
		case ActionTypes.ANALYSIS_LEVEL_HANDLE:
		case ActionTypes.ANALYSIS_MATH_HANDLE:
			storeInstance.handle(action.data);
			break;
		default:
			return;
	}

	//storeInstance.emitChange();

});

export default storeInstance;
