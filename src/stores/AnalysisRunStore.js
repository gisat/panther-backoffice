import ApiStore from './ApiStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventTypes from '../constants/EventTypes';
import AnalysisRunModel from '../models/AnalysisRunModel';

//import UserStore from './UserStore';
import AnalysisStore from './AnalysisStore';
import GeneralLayerStore from './GeneralLayerStore';
import ScopeStore from './ScopeStore';
import PlaceStore from './PlaceStore';
import PeriodStore from './PeriodStore';

import logger from '../core/Logger';

class AnalysisRunStore extends ApiStore {

	getApiUrl(){
		return "/rest/performedanalysis";
	}

	getCreateApiUrl() {
		return "/api/analysis/create";
	}

	registerListeners(){
		//this.changeListener.add(UserStore);
		this.changeListener.add(AnalysisStore);
		this.changeListener.add(GeneralLayerStore);
		this.changeListener.add(ScopeStore);
		this.changeListener.add(PlaceStore);
		this.changeListener.add(PeriodStore);
	}

	getInstance(options,data){
		return new AnalysisRunModel(options,data);
	}

}

let storeInstance = new AnalysisRunStore();

storeInstance.dispatchToken = AppDispatcher.register(action => {
	logger.trace("AnalysisRunStore# received(), Action: ", action);

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
