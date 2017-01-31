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
		return "/rest/run/analysis";
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
			storeInstance.handle(action.data, action.operationId);
			setTimeout(reloadThisStoreUntilAllFinished, 500);
			break;
		default:
			return;
	}

});

/**
 * It is used for querying the state of on demand information. Based on this state it either issues new demand or deems itself successful.
 */
function reloadThisStoreUntilAllFinished() {
	logger.info("AnalysisRunStore#reloadThisStoreUntilAllFinished Issue new request for reload. Current time: ", new Date());

	let promisesOfLoad = storeInstance.reloadInternal();
	if(!promisesOfLoad) {
		setTimeout(reloadThisStoreUntilAllFinished, 500);
		return;
	}

	promisesOfLoad.then(function(models){
		let containsInformation = true;
		models.forEach(function(model){
			if(!model.status) {
				containsInformation = false;
			}
		});

		if(!containsInformation) {
			setTimeout(reloadThisStoreUntilAllFinished, 500);
		} else {
			storeInstance.emitChange();
		}
	});
}

export default storeInstance;
